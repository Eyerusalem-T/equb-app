"use client";
import { useActionState } from "react";
import { createGroup, type State } from "@/app/(app)/actions";
export default function GroupForm() {
  const [state, action, pending] = useActionState(createGroup, {} as State);
  return (
    <form action={action} className="panel stack">
      <h2 className="h3">Start a circle</h2>
      <label className="field">Circle name<input name="name" required minLength={2} maxLength={40} placeholder="Dorm 4B laptop fund" /></label>
      <label className="field">Contribution per member (Birr)<input name="amount" type="number" inputMode="numeric" min={50} max={1000000} step={1} required placeholder="500" /></label>
      <label className="field">How often
        <select name="cadence" defaultValue="weekly"><option value="weekly">Every week</option><option value="biweekly">Every 2 weeks</option><option value="monthly">Every month</option></select>
      </label>
      <label className="check"><input type="checkbox" name="public" /> Publish a read-only progress page</label>
      <p className="error" role="alert">{state.error}</p>
      <button className="btn primary" disabled={pending}>{pending ? "Creating…" : "Create circle"}</button>
    </form>
  );
}
