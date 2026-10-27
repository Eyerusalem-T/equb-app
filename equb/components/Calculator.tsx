"use client";
import { useState } from "react";
import { CADENCE, DAYS, etb } from "@/lib/equb";
/** Client island: instant feedback while sliding, no server round trip. */
export default function Calculator() {
  const [n, setN] = useState(10), [amt, setAmt] = useState(500), [c, setC] = useState<keyof typeof CADENCE>("weekly");
  const pot = n * amt, days = n * DAYS[c];
  return (
    <div className="panel stack calc" aria-labelledby="calc-h">
      <h2 className="h3" id="calc-h">What could your circle save?</h2>
      <label className="field">Members: <b>{n}</b>
        <input type="range" min={3} max={30} value={n} onChange={(e) => setN(+e.target.value)} />
      </label>
      <label className="field">Each pays: <b>{etb(amt)}</b>
        <input type="range" min={100} max={10000} step={100} value={amt} onChange={(e) => setAmt(+e.target.value)} />
      </label>
      <label className="field">How often
        <select value={c} onChange={(e) => setC(e.target.value as keyof typeof CADENCE)}>
          {Object.entries(CADENCE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </label>
      <p className="pot" aria-live="polite"><span>One member receives</span><strong>{etb(pot)}</strong><span>every round, for {Math.round(days / 7)} weeks until everyone has had a turn.</span></p>
    </div>
  );
}
