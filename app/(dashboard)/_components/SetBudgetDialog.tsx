"use client";

import { Dialog, DialogContent, DialogTrigger } from "components/ui/dialog";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const SetBudgetDialog = () => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; 
  const currentYear = now.getFullYear();

  const [budget, setBudget] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!budget || isNaN(Number(budget))) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/budget-limit", {
        method: "POST",
        body: JSON.stringify({
          amount: parseFloat(budget),
          month: currentMonth,
          year: currentYear,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
      } else {
        toast.success("Monthly budget set! 🎯");
        setOpen(false);
        setBudget("");
      }
    } catch (err) {
      toast.error("Failed to set budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="min-w-[150px]">
          Set Budget 📊
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Set Monthly Budget</h2>
          <p className="text-muted-foreground">
            {currentMonth}/{currentYear}
          </p>

          <div className="space-y-2">
            <Label>Budget Amount (Rs)</Label>
            <Input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save Budget"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SetBudgetDialog;
