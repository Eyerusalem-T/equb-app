import Link from "next/link";
import Calculator from "@/components/Calculator";

export default function Home() {
  return (
    <main id="main">
      <header className="wrap nav"><Link href="/" className="logo">Equb <span lang="am">እቁብ</span></Link>
        <nav aria-label="Account"><Link href="/signin">Sign in</Link><Link href="/signup" className="btn primary sm">Start free</Link></nav></header>
      <section className="wrap hero">
        <div>
          <h1>Save together. <br />Keep the receipts.</h1>
          <p className="lead">Most equbs run on a notebook and a group chat, and most arguments start there too. Equb gives every circle one honest record: who has paid, whose turn it is, and how much is in the pot.</p>
          <div className="row"><Link href="/signup" className="btn primary">Start a circle</Link><Link href="/signin" className="btn ghost">I already have one</Link></div>
        </div>
        <Calculator />
      </section>
      <section className="wrap problems" aria-labelledby="why">
        <h2 id="why" className="h2">Three problems it solves</h2>
        <ul className="cards">
          <li><h3>“Did I pay?”</h3><p>One tap marks a contribution. Everyone sees the same count, so memory is no longer the system.</p></li>
          <li><h3>“Whose turn is it?”</h3><p>Members are ordered once, before round 1. The recipient is shown on every screen, so nobody can quietly reshuffle.</p></li>
          <li><h3>“Can I trust it?”</h3><p>Publish a read-only page. Members check progress themselves, with no sign-in and no private data shown.</p></li>
        </ul>
      </section>
      <section className="wrap student">
        <h2 className="h2">Built for a student budget</h2>
        <p>A ten-person weekly circle at 500 Birr pays one member 5,000 Birr every week. That is a laptop deposit, a semester of books or a first stock of goods, without a loan or interest.</p>
      </section>
    </main>
  );
}
