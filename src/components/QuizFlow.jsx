import { useState } from "react";
import { QUESTIONS, matchHouses } from "../lib/matcher.js";
import Question from "./Question.jsx";
import Results from "./Results.jsx";

// QuizFlow – styrer hele flyten: ett spørsmål om gangen, progress-bar,
// tilbake-knapp (svar bevares), og til slutt resultatskjermen.
export default function QuizFlow() {
  const [step, setStep] = useState(0);
  const [svar, setSvar] = useState({});
  const [ferdig, setFerdig] = useState(false);

  const totalt = QUESTIONS.length;
  const aktiv = QUESTIONS[step];
  // Progress vises som «hvor langt er du kommet» (1-basert).
  const progress = Math.round(((step + 1) / totalt) * 100);

  function velg(key, value) {
    const oppdatert = { ...svar, [key]: value };
    setSvar(oppdatert);

    // Liten pause så valget rekker å vises før vi bytter skjerm.
    setTimeout(() => {
      if (step < totalt - 1) {
        setStep(step + 1);
      } else {
        setFerdig(true);
      }
    }, 180);
  }

  function tilbake() {
    if (step > 0) setStep(step - 1);
  }

  function startPaNytt() {
    setSvar({});
    setStep(0);
    setFerdig(false);
  }

  if (ferdig) {
    const topp3 = matchHouses(svar);
    return <Results topp3={topp3} svar={svar} onRestart={startPaNytt} />;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      {/* Progress-bar */}
      <div className="mb-2 flex items-center justify-between text-sm text-koks/60">
        <span>
          Spørsmål {step + 1} av {totalt}
        </span>
        <span>{progress}%</span>
      </div>
      <div className="mb-10 h-2 w-full overflow-hidden rounded-full bg-salvie-lys">
        <div
          className="h-full rounded-full bg-salvie transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Question question={aktiv} value={svar[aktiv.key]} onSelect={velg} />

      {/* Tilbake-knapp */}
      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={tilbake}
          disabled={step === 0}
          className="rounded-full px-5 py-2 text-koks/70 transition-colors hover:text-koks disabled:cursor-not-allowed disabled:opacity-0"
        >
          ← Tilbake
        </button>
        <span className="text-sm text-koks/50">Velg et alternativ for å gå videre</span>
      </div>
    </div>
  );
}
