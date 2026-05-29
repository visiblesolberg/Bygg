import { useEffect, useState } from "react";
import Logo from "./Logo.jsx";

const STEG = [
  "Leser henvendelsen…",
  "Rydder scope…",
  "Ser på bildene…",
  "Sjekker norske krav…",
  "Setter opp tilbudsutkast…",
];

// Vennlig, tillitsvekkende lasteskjerm med rullerende statustekst.
export default function LoadingState() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setI((prev) => (prev + 1 < STEG.length ? prev + 1 : prev));
    }, 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fade-in mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <Logo size="lg" />

      <div className="mt-12 flex items-center gap-3">
        <span className="pulse-dot h-4 w-4 rounded-full bg-bygg" style={{ animationDelay: "0s" }} />
        <span className="pulse-dot h-4 w-4 rounded-full bg-bygg" style={{ animationDelay: "0.18s" }} />
        <span className="pulse-dot h-4 w-4 rounded-full bg-bygg" style={{ animationDelay: "0.36s" }} />
      </div>

      <p className="mt-8 text-2xl font-bold text-white">{STEG[i]}</p>
      <p className="mt-3 text-lg text-gray-400">
        ByggPilot rydder kaoset til et tilbuds-klart utkast.
      </p>

      <div className="mt-10 h-2 w-full max-w-sm overflow-hidden rounded-full bg-antrasitt-600">
        <div
          className="h-full rounded-full bg-bygg transition-all duration-700 ease-out"
          style={{ width: `${((i + 1) / STEG.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
