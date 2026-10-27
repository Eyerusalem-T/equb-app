import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { signOut } from "../(auth)/actions";

export const metadata = { robots: { index: false, follow: false } };

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();           // Layer 2: re-checks the user exists
  if (!user) redirect("/signin");
  return (
    <>
      <header className="wrap nav"><Link href="/groups" className="logo">Equb <span lang="am">እቁብ</span></Link>
        <nav aria-label="Account"><span className="muted">@{user.handle}</span>
          <form action={signOut}><button className="btn ghost sm">Sign out</button></form></nav></header>
      <main id="main" className="wrap">{children}</main>
    </>
  );
}
