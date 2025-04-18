import { PiggyBank } from "lucide-react";
import React from "react";

function Logo() {
  return (
    <a href="/logo.png" className="flex items-center gap-2">
      <PiggyBank className="stroke h-11 stroke-amber-500 stroker-[1.5]" />
      <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        Budget Tracker
      </p>
    </a>
  );
}

export function LogoMobile() {
  return (
    <a href="/logo.png" className="flex items-center gap-2">
      <PiggyBank className="stroke h-11 stroke-amber-500 stroker-[1.5]" />
      <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        Budget Tracker
      </p>
    </a>
  );
}

export default Logo;
