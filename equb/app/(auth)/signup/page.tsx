import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import { signUp } from "../actions";
export const metadata: Metadata = { title: "Create account" };
export default function Page() { return <main id="main" className="wrap narrow"><AuthForm action={signUp} mode="signup" /></main>; }
