"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, type Group } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { summarize } from "@/lib/equb";

export type State = { error?: string; ok?: boolean };
const CADENCES = ["weekly", "biweekly", "monthly"];

/** Check 1: signed in. Check 2: this circle belongs to that user. Every action starts here. */
async function owned(id: string) {
  const user = await requireUser();
  const g = db.groupById(id);
  if (!g || g.userId !== user.id) throw new Error("Not found");
  return g;
}
const refresh = (g: Group) => { revalidatePath("/groups"); revalidatePath(`/groups/${g.id}`); revalidatePath(`/g/${g.slug}`); };

export async function createGroup(_: State, fd: FormData): Promise<State> {
  const user = await requireUser();
  const name = String(fd.get("name") ?? "").trim();
  const amount = Number(fd.get("amount"));
  const cadence = String(fd.get("cadence"));
  if (name.length < 2 || name.length > 40) return { error: "Give the circle a name of 2 to 40 characters." };
  if (!Number.isInteger(amount) || amount < 50 || amount > 1_000_000) return { error: "Contribution must be a whole number from 50 to 1,000,000 Birr." };
  if (!CADENCES.includes(cadence)) return { error: "Choose how often members pay." };
  const g = db.addGroup(user.id, name, amount, cadence as Group["cadence"], fd.get("public") === "on");
  redirect(`/groups/${g.id}`);
}
export async function addMember(gid: string, _: State, fd: FormData): Promise<State> {
  const g = await owned(gid);
  const name = String(fd.get("name") ?? "").trim();
  if (name.length < 2 || name.length > 30) return { error: "Member name: 2 to 30 characters." };
  if (g.round > 1) return { error: "Members are locked once round 1 is closed, so the draw stays fair." };
  if (db.membersOf(gid).length >= 30) return { error: "A circle can hold up to 30 members." };
  db.addMember(gid, name); refresh(g); return { ok: true };
}
export async function removeMember(gid: string, mid: string) {
  const g = await owned(gid);
  if (g.round > 1) throw new Error("Locked");
  db.removeMember(gid, mid); refresh(g);
}
export async function togglePaid(gid: string, mid: string) {
  const g = await owned(gid);
  const members = db.membersOf(gid);
  if (!members.some((m) => m.id === mid) || g.round > members.length) throw new Error("Not found");
  db.togglePayment(gid, mid, g.round); refresh(g);
}
export async function advanceRound(gid: string) {
  const g = await owned(gid);
  const s = summarize(g, db.membersOf(gid), db.paymentsOf(gid));
  if (s.done || !s.allPaid) throw new Error("Everyone must pay before the round closes");
  db.advance(gid); refresh(g);
}
export async function togglePublic(gid: string) { const g = await owned(gid); db.setPublic(gid, !g.isPublic); refresh(g); }
export async function deleteGroup(gid: string) { const g = await owned(gid); db.deleteGroup(gid); refresh(g); redirect("/groups"); }
