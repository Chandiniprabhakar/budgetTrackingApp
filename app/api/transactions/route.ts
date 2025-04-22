import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { startOfMonth, endOfMonth } from "date-fns";

export async function POST(req: Request) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { amount, date, type, category, note } = await req.json();

  // 1. Save the transaction
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      amount,
      date: new Date(date),
      type,
      category,
      note,
    },
  });

  // 2. Only check budget if it's an expense
  if (type === "expense") {
    const txDate = new Date(date);
    const month = txDate.getMonth() + 1;
    const year = txDate.getFullYear();

    const budget = await prisma.budgetLimit.findUnique({
      where: {
        userId_month_year: {
          userId,
          month,
          year,
        },
      },
    });

    if (budget) {
      const from = startOfMonth(txDate);
      const to = endOfMonth(txDate);

      const totalExpenses = await prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          userId,
          type: "expense",
          date: {
            gte: from,
            lte: to,
          },
        },
      });

      const spent = totalExpenses._sum.amount ?? 0;

      if (spent <= budget.limit) {
        const alreadyRewarded = await prisma.userPoints.findFirst({
          where: {
            userId,
            reason: {
              equals: `Stayed within budget - ${month}/${year}`,
            },
          },
        });

        if (!alreadyRewarded) {
          await prisma.userPoints.create({
            data: {
              userId,
              points: 100,
              reason: `Stayed within budget - ${month}/${year}`,
            },
          });

          await prisma.notification.create({
            data: {
              userId,
              type: "reward",
              message: `🎉 You stayed within your ₹${budget.limit} budget for ${month}/${year} and earned 100 points!`,
            },
          });
        }
      }
    }
  }

  return NextResponse.json(transaction);
}
