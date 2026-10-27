import "server-only";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type User = { id: string; handle: string; salt: string; hash: string };
export type Group = { id: string; userId: string; name: string; amount: number; cadence: "weekly" | "biweekly" | "monthly"; round: number; isPublic: boolean; slug: string; createdAt: string };
export type Member = { id: string; groupId: string; name: string; order: number };
export type Payment = { groupId: string; memberId: string; round: number };
type DB = { users: User[]; groups: Group[]; members: Member[]; payments: Payment[] };

const dir = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), ".data");
const file = path.join(dir, "db.json");
const read = (): DB => { try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return { users: [], groups: [], members: [], payments: [] }; } };
const write = (d: DB) => { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(file, JSON.stringify(d)); };

export const db = {
  userByHandle: (h: string) => read().users.find((u) => u.handle === h),
  userById: (id: string) => read().users.find((u) => u.id === id),
  createUser(handle: string, salt: string, hash: string) { const d = read(); const u = { id: randomUUID(), handle, salt, hash }; d.users.push(u); write(d); return u; },
  groupsFor: (userId: string) => read().groups.filter((g) => g.userId === userId),
  groupById: (id: string) => read().groups.find((g) => g.id === id),
  groupBySlug: (slug: string) => read().groups.find((g) => g.slug === slug && g.isPublic),
  addGroup(userId: string, name: string, amount: number, cadence: Group["cadence"], isPublic: boolean) {
    const d = read();
    const g: Group = { id: randomUUID(), userId, name, amount, cadence, round: 1, isPublic, createdAt: new Date().toISOString(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30) + "-" + randomUUID().slice(0, 4) };
    d.groups.push(g); write(d); return g;
  },
  setPublic(id: string, v: boolean) { const d = read(); const g = d.groups.find((x) => x.id === id); if (g) g.isPublic = v; write(d); },
  advance(id: string) { const d = read(); const g = d.groups.find((x) => x.id === id); if (g) g.round += 1; write(d); },
  deleteGroup(id: string) { const d = read(); d.groups = d.groups.filter((g) => g.id !== id); d.members = d.members.filter((m) => m.groupId !== id); d.payments = d.payments.filter((p) => p.groupId !== id); write(d); },
  membersOf: (gid: string) => read().members.filter((m) => m.groupId === gid).sort((a, b) => a.order - b.order),
  addMember(gid: string, name: string) { const d = read(); const order = d.members.filter((m) => m.groupId === gid).length + 1; d.members.push({ id: randomUUID(), groupId: gid, name, order }); write(d); },
  removeMember(gid: string, mid: string) {
    const d = read(); d.members = d.members.filter((m) => !(m.id === mid && m.groupId === gid)); d.payments = d.payments.filter((p) => p.memberId !== mid);
    d.members.filter((m) => m.groupId === gid).sort((a, b) => a.order - b.order).forEach((m, i) => (m.order = i + 1)); write(d);
  },
  paymentsOf: (gid: string) => read().payments.filter((p) => p.groupId === gid),
  togglePayment(gid: string, mid: string, round: number) {
    const d = read(); const i = d.payments.findIndex((p) => p.groupId === gid && p.memberId === mid && p.round === round);
    if (i >= 0) d.payments.splice(i, 1); else d.payments.push({ groupId: gid, memberId: mid, round }); write(d);
  },
  publicSlugs: () => read().groups.filter((g) => g.isPublic).map((g) => g.slug),
};
