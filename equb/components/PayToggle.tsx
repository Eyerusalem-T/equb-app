"use client";
import { useOptimistic, useTransition } from "react";
import { togglePaid } from "@/app/(app)/actions";
export default function PayToggle({ gid, mid, paid, name }: { gid: string; mid: string; paid: boolean; name: string }) {
  const [on, setOn] = useOptimistic(paid);
  const [pending, start] = useTransition();
  return (
    <button type="button" className={on ? "pay paid" : "pay"} aria-pressed={on} aria-label={`${name}: ${on ? "paid" : "not paid"}`} disabled={pending}
      onClick={() => start(async () => { setOn(!on); await togglePaid(gid, mid); })}>
      {on ? "Paid ✓" : "Mark paid"}
    </button>
  );
}
