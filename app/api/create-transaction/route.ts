import prisma from "@/lib/prisma";
import { CreateTransactionSchema } from "@/schema/transaction";
import { getAuth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("CREATE TRANSACTION HIT");

  try {
    const { userId } = getAuth(req);
    console.log("User ID from auth:", userId);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("BODY PARSED:", body);

    const validatedData = CreateTransactionSchema.parse(body);
    const transactionDate = new Date(validatedData.date);

    console.log("Validated Data:", validatedData);
    console.log("Transaction Date:", transactionDate);

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount: validatedData.amount,
        description: validatedData.description ?? "",
        date: transactionDate,
        category: validatedData.category,
        type: validatedData.type,
        categoryIcon: "📘",
      },
    });

    let warningToast = false;
    let spent = 0;
    let remainingBudget = null;

    const budgetLimit = await prisma.budgetLimit.findUnique({
      where: {
        userId_month_year: {
          userId,
          month: transactionDate.getMonth() + 1,
          year: transactionDate.getFullYear(),
        },
      },
    });

    if (budgetLimit) {
      const totalSpent = await prisma.transaction.aggregate({
        where: {
          userId,
          type: "expense",
          date: {
            gte: new Date(transactionDate.getFullYear(), transactionDate.getMonth(), 1),
            lte: transactionDate,
          },
        },
        _sum: {
          amount: true,
        },
      });

      spent = totalSpent._sum.amount || 0;
      remainingBudget = budgetLimit.limit - spent;
      const percentSpent = (spent / budgetLimit.limit) * 100;

      console.log("Spent:", spent, "Remaining:", remainingBudget, "Percent:", percentSpent);

      if (percentSpent >= 80 && percentSpent < 100) {
        warningToast = true;
      }

      if (remainingBudget >= 0) {
        let bonusPoints = 10;
        const percentLeft = (remainingBudget / budgetLimit.limit) * 100;

        if (percentLeft > 30) {
          bonusPoints = 30;
        } else if (percentLeft > 10) {
          bonusPoints = 20;
        }

        await prisma.userPoints.create({
          data: {
            userId,
            points: bonusPoints,
            reason: `(Reward) ${bonusPoints} pts: Stayed under budget in ${transactionDate.getMonth() + 1}/${transactionDate.getFullYear()}`,
          },
        });
      }
    }

    const totalPoints = await prisma.userPoints.aggregate({
      where: { userId },
      _sum: {
        points: true,
      },
    });

    return NextResponse.json({
      transaction,
      warning: warningToast,
      totalPoints: totalPoints._sum.points ?? 0,
      remainingBudget,
    });
  } catch (error: any) {
    console.error("API ERROR:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma Error Code:", error.code);
      console.error("Prisma Error Meta:", error.meta);
    }

    return NextResponse.json(
      {
        message: "Failed to create transaction",
        error: error.message ?? error,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
