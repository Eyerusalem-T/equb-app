import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { summarize, etb, CADENCE } from "@/lib/equb";
import { addMember, removeMember, advanceRound, togglePublic, deleteGroup } from "../../actions";
import PotRing from "@/components/PotRing";
import PayToggle from "@/components/PayToggle";
import MemberForm from "@/components/MemberForm";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const g = db.groupById((await params).id); return { title: g ? g.name : "Circle" };
}
export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const g = db.groupById(id);
  if (!g || g.userId !== user.id) notFound();          // someone else's id looks exactly like a missing one
  const members = db.membersOf(g.id);
  const s = summarize(g, members, db.paymentsOf(g.id));
  const site = process.env.SITE_URL || "http://localhost:3000";
  return (
    <>
      <h1 className="h1">{g.name}</h1>
      <p className="muted">{etb(g.amount)} · {CADENCE[g.cadence]} · pot {etb(s.pot)}</p>
      <div className="two top">
        <section className="panel" aria-labelledby="round">
          <h2 id="round" className="h3">{s.done ? "Cycle complete" : `Round ${g.round} of ${s.n || "?"}`}</h2>
          {s.n > 0 && <div className="group"><PotRing pct={s.done ? 100 : s.pct} label={`${s.paid.length} of ${s.n} paid`} />
            <div><p><b>{etb(s.collected)}</b> of {etb(s.pot)} collected</p>
              {s.recipient && <p className="recipient">Payout goes to <b>{s.recipient.name}</b></p>}
              {s.unpaid.length > 0 && !s.done && <p className="muted">Waiting on {s.unpaid.map((m) => m.name).join(", ")}</p>}</div></div>}
          {!s.done && <form action={advanceRound.bind(null, g.id)}>
            <button className="btn primary" disabled={!s.allPaid}>Close round {g.round} and pay {s.recipient?.name ?? "…"}</button>
            {!s.allPaid && <p className="muted">Everyone must pay before the round can close.</p>}</form>}
        </section>
        <section className="panel stack" aria-labelledby="share">
          <h2 id="share" className="h3">Share progress</h2>
          <p className="muted">{g.isPublic ? "Anyone with the link can see names and payment status. No contact details are stored or shown." : "Private. Only you can see this circle."}</p>
          {g.isPublic && <p><code className="link">{site}/g/{g.slug}</code></p>}
          <form action={togglePublic.bind(null, g.id)}><button className="btn ghost">{g.isPublic ? "Make private" : "Publish progress page"}</button></form>
        </section>
      </div>
      <section aria-labelledby="mem" className="panel stack">
        <h2 id="mem" className="h3">Members in payout order</h2>
        {members.length === 0 ? <p className="empty-note">No members yet. Add the first one below. Order of adding is the payout order.</p> :
          <ol className="members">{members.map((m) => (
            <li key={m.id} className={s.recipient?.id === m.id ? "now" : ""}>
              <span className="name">{m.name}{s.recipient?.id === m.id && <em> · next payout</em>}</span>
              {!s.done && <PayToggle gid={g.id} mid={m.id} paid={s.paidIds.has(m.id)} name={m.name} />}
              {g.round === 1 && <form action={removeMember.bind(null, g.id, m.id)}><button className="x" aria-label={`Remove ${m.name}`}>×</button></form>}
            </li>))}</ol>}
        {g.round === 1 ? <MemberForm action={addMember.bind(null, g.id)} /> : <p className="muted">Members are locked after round 1 so the order stays fair.</p>}
      </section>
      <form action={deleteGroup.bind(null, g.id)} className="danger"><button className="btn danger">Delete this circle</button></form>
    </>
  );
}
