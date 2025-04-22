import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { CreateTransactionSchema } from "@/schema/transaction";

export async function POST(req: Request) {
  console.log("CREATE TRANSACTION HIT");

  const { userId } = auth();
  console.log("User ID from auth:", userId);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
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

      const spent = totalSpent._sum.amount || 0;
      const remainingBudget = budgetLimit.limit - spent;
      const percentSpent = (spent / budgetLimit.limit) * 100;

      console.log("Spent:", spent, "Remaining:", remainingBudget, "Percent:", percentSpent);

      if (percentSpent >= 80 && percentSpent < 100) {
        warningToast = true;
      }

      if (remainingBudget >= 0) {
        await prisma.userPoints.create({
          data: {
            userId,
            points: 10,
            reason: `(Demo) Stayed within budget for ${transactionDate.getMonth() + 1}/${transactionDate.getFullYear()}`,
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
    });
  } catch (error: any) {
    console.error("API ERROR:", error);
    
    // Check if it's a Prisma error (for database issues)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma Error Code:", error.code);
      console.error("Prisma Error Meta:", error.meta);
    }
    
    // Return a clearer error message
    return NextResponse.json(
      {
        message: "Failed to create transaction",
        error: error.message ?? error,
        stack: error.stack, // Log the stack for more detailed trace
      },
      { status: 500 }
    );
  }
};  
