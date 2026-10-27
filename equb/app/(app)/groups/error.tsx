"use client";
export default function Err({ reset }: { error: Error; reset: () => void }) {
  return <div className="panel stack" role="alert"><h1 className="h3">That did not work</h1><p>Something went wrong on our side. Your records are safe. Try again.</p><button className="btn primary" onClick={reset}>Try again</button></div>;
}
