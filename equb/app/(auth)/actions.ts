"use server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword, checkPassword, startSession, endSession, safeNext } from "@/lib/auth";

export type State = { error?: string };
const HANDLE = /^[a-z0-9_]{3,20}$/;

export async function signUp(_: State, fd: FormData): Promise<State> {
  const handle = String(fd.get("handle") ?? "").trim().toLowerCase();
  const pw = String(fd.get("password") ?? "");
  if (!HANDLE.test(handle)) return { error: "Handle: 3 to 20 letters, numbers or underscores." };
  if (pw.length < 8) return { error: "Password needs at least 8 characters." };
  if (db.userByHandle(handle)) return { error: "That handle is taken. Pick another." };
  const { salt, hash } = hashPassword(pw);
  await startSession(db.createUser(handle, salt, hash).id);
  redirect("/groups");
}
export async function signIn(_: State, fd: FormData): Promise<State> {
  const u = db.userByHandle(String(fd.get("handle") ?? "").trim().toLowerCase());
  const pw = String(fd.get("password") ?? "");
  // Same message for unknown handle and wrong password: never reveal which exists.
  if (!u || !checkPassword(pw, u.salt, u.hash)) return { error: "Handle or password is wrong." };
  await startSession(u.id);
  redirect(safeNext(fd.get("next")));
}
export async function signOut() { await endSession(); redirect("/"); }
