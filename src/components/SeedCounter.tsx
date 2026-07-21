import { useState } from "react";

export default function SeedCounter() {
  const [seeds, setSeeds] = useState(1);
  return (
    <div className="seed-counter">
      <p aria-live="polite">{Array.from({ length: seeds }, (_, index) => <span key={index} aria-hidden="true">❧</span>)}</p>
      <button type="button" onClick={() => setSeeds((count) => Math.min(count + 1, 8))} disabled={seeds >= 8}>
        {seeds >= 8 ? "The pot is full" : "Plant a small idea"}
      </button>
    </div>
  );
}

