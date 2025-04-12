import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Overview from "./_components/Overview";
import History from "./_components/History";

async function page() {
  const user = await currentUser();

  if (!user?.id) {
    redirect("/sign-in");
    return null;
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  });

  if (!userSettings) {
    redirect("/wizard");
    return null;
  }

  return (
    <div className="h-full w-full p-6">
      {/* Header with greeting and buttons */}
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Hello, {user.firstName}! 👋
          </h1>
          <p className="text-muted-foreground">Here’s your financial summary</p>
        </div>
  
        <div className="flex flex-wrap gap-4">
          <CreateTransactionDialog
            trigger={
              <Button
                size="lg"
                className="min-w-[150px] border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700"
              >
                New income 💰
              </Button>
            }
            type="income"
          />
          <CreateTransactionDialog
            trigger={
              <Button
                size="lg"
                className="min-w-[150px] border-rose-500 bg-rose-950 text-white hover:bg-rose-700"
              >
                New expense 💸
              </Button>
            }
            type="expense"
          />
        </div>
      </div>
  
      {/* Main grid content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-card p-6 shadow-md">
          <Overview userSettings={userSettings} />
        </div>
        <div className="rounded-xl bg-card p-6 shadow-md">
          <History userSettings={userSettings} />
        </div>
      </div>
    </div>
  );
  
}

export default page;
