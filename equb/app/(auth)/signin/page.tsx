import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import { signIn } from "../actions";
import { safeNext } from "@/lib/auth";
export const metadata: Metadata = { title: "Sign in" };
export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <main id="main" className="wrap narrow"><AuthForm action={signIn} mode="signin" next={safeNext(next)} /></main>;
}
