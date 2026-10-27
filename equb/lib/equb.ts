import type { Group, Member, Payment } from "./db";
export const etb = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n) + " Birr";
export const CADENCE = { weekly: "Every week", biweekly: "Every 2 weeks", monthly: "Every month" } as const;
export const DAYS = { weekly: 7, biweekly: 14, monthly: 30 } as const;
/** Everything a screen needs to know about one circle, derived in one place. */
export function summarize(g: Group, members: Member[], payments: Payment[]) {
  const n = members.length;
  const done = n > 0 && g.round > n;
  const paidIds = new Set(payments.filter((p) => p.round === g.round).map((p) => p.memberId));
  const paid = members.filter((m) => paidIds.has(m.id));
  const unpaid = members.filter((m) => !paidIds.has(m.id));
  const recipient = done || !n ? null : members[g.round - 1];
  return { n, done, paidIds, paid, unpaid, recipient, pot: g.amount * n, collected: g.amount * paid.length,
    pct: n ? Math.round((paid.length / n) * 100) : 0, allPaid: n > 1 && unpaid.length === 0 };
}
