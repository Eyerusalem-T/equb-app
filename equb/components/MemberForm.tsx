"use client";
import { useActionState, useEffect, useRef } from "react";
type State = { error?: string; ok?: boolean };
export default function MemberForm({ action }: { action: (s: State, f: FormData) => Promise<State> }) {
  const [state, act, pending] = useActionState(action, {} as State);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state.ok) ref.current?.reset(); }, [state]);
  return (
    <form ref={ref} action={act} className="inline-form">
      <label className="field grow">Add a member<input name="name" required minLength={2} maxLength={30} placeholder="Full name" /></label>
      <button className="btn primary" disabled={pending}>{pending ? "Adding…" : "Add"}</button>
      <p className="error full" role="alert">{state.error}</p>
    </form>
  );
}
