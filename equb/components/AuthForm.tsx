"use client";
import { useActionState } from "react";
import Link from "next/link";
type State = { error?: string };
export default function AuthForm({ action, mode, next }: { action: (s: State, f: FormData) => Promise<State>; mode: "signin" | "signup"; next?: string }) {
  const [state, formAction, pending] = useActionState(action, {} as State);
  const up = mode === "signup";
  return (
    <form action={formAction} className="panel stack" noValidate>
      <h1 className="h2">{up ? "Open your equb book" : "Welcome back"}</h1>
      <p className="muted">{up ? "Free. No phone number or bank details needed." : "Sign in to manage your circles."}</p>
      {next && <input type="hidden" name="next" value={next} />}
      <label className="field">Handle
        <input name="handle" autoComplete="username" required minLength={3} maxLength={20} placeholder="abebe_k" />
      </label>
      <label className="field">Password
        <input name="password" type="password" autoComplete={up ? "new-password" : "current-password"} required minLength={8} />
      </label>
      <p className="error" role="alert">{state.error}</p>
      <button className="btn primary" disabled={pending}>{pending ? "One moment…" : up ? "Create account" : "Sign in"}</button>
      <p className="muted">{up ? <>Already have an account? <Link href="/signin">Sign in</Link></> : <>New here? <Link href="/signup">Create an account</Link></>}</p>
    </form>
  );
}
