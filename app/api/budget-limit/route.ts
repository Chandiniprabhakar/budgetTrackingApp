import { NextResponse } from "next/server";
import prisma from "lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    const { userId } = getAuth(req);

  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { amount, month, year } = await req.json();

    const budget = await prisma.budgetLimit.upsert({
      where: {
        userId_month_year: {
          userId,
          month,
          year,
        },
      },
      update: {
        limit: amount,
      },
      create: {
        userId,
        month,
        year,
        limit: amount,
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json({ message: "Failed to save budget" }, { status: 500 });
  }
}
