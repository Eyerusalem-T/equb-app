import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { summarize, etb, CADENCE } from "@/lib/equb";
import PotRing from "@/components/PotRing";

export const revalidate = 60;   // public, read-heavy: cached and refreshed every minute
export async function generateStaticParams() { return db.publicSlugs().map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = db.groupBySlug((await params).slug);
  if (!g) return { title: "Circle not found", robots: { index: false } };
  return { title: g.name, description: `${g.name}: ${etb(g.amount)} ${CADENCE[g.cadence].toLowerCase()}. Live progress of this equb circle.`, alternates: { canonical: `/g/${g.slug}` } };
}
export default async function Public({ params }: { params: Promise<{ slug: string }> }) {
  const g = db.groupBySlug((await params).slug);
  if (!g) notFound();
  const s = summarize(g, db.membersOf(g.id), db.paymentsOf(g.id));
  return (
    <main id="main" className="wrap narrow">
      <p><Link href="/">← Equb</Link></p>
      <h1 className="h1">{g.name}</h1>
      <p className="muted">{etb(g.amount)} · {CADENCE[g.cadence]} · read-only</p>
      {s.n === 0 ? <div className="panel empty"><h2 className="h3">Not started yet</h2><p>The organiser has not added members. Check back soon.</p></div> :
        <section className="panel stack" aria-label="Progress">
          <div className="group"><PotRing pct={s.done ? 100 : s.pct} label={g.name} />
            <div><h2 className="h3">{s.done ? "Cycle complete" : `Round ${g.round} of ${s.n}`}</h2>
              {s.recipient && <p className="recipient">Payout to <b>{s.recipient.name}</b></p>}
              <p>{etb(s.collected)} of {etb(s.pot)} collected</p></div></div>
          <ul className="members">{db.membersOf(g.id).map((m) => <li key={m.id} className={s.recipient?.id === m.id ? "now" : ""}><span className="name">{m.name}</span><span className={s.paidIds.has(m.id) ? "tag ok" : "tag"}>{s.done ? "done" : s.paidIds.has(m.id) ? "Paid" : "Waiting"}</span></li>)}</ul>
        </section>}
    </main>
  );
}
