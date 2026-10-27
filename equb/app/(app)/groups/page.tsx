import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { summarize, etb, CADENCE } from "@/lib/equb";
import GroupForm from "@/components/GroupForm";
import PotRing from "@/components/PotRing";
export const metadata: Metadata = { title: "My circles" };

export default async function Groups() {
  const user = await requireUser();
  const groups = db.groupsFor(user.id).map((g) => ({ g, s: summarize(g, db.membersOf(g.id), db.paymentsOf(g.id)) }));
  return (
    <div className="two">
      <section aria-labelledby="mine">
        <h1 id="mine" className="h2">My circles</h1>
        {groups.length === 0 ? (
          <div className="empty panel">
            <h2 className="h3">No circles yet</h2>
            <p>An equb is a group that pays the same amount each round while one member takes the whole pot. Start your first circle on the right, then add members.</p>
          </div>
        ) : (
          <ul className="list">
            {groups.map(({ g, s }) => (
              <li key={g.id} className="panel group">
                <PotRing pct={s.pct} label={g.name} />
                <div>
                  <h2 className="h3"><Link href={`/groups/${g.id}`}>{g.name}</Link></h2>
                  <p className="muted">{etb(g.amount)} · {CADENCE[g.cadence]} · {s.n} member{s.n === 1 ? "" : "s"}</p>
                  <p>{s.done ? "Cycle complete 🎉" : s.n < 2 ? "Add at least 2 members to begin." : <>Round {g.round} of {s.n}. Next payout: <b>{s.recipient?.name}</b></>}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <GroupForm />
    </div>
  );
}
