// Question – viser ett spørsmål med store, tommel-vennlige svarknapper.
export default function Question({ question, value, onSelect }) {
  return (
    <div className="fade-in">
      <h2 className="text-2xl sm:text-3xl font-semibold text-koks mb-8 text-center leading-snug">
        {question.sporsmal}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.valg.map((valg) => {
          const valgt = value === valg.value;
          return (
            <button
              key={valg.value}
              type="button"
              onClick={() => onSelect(question.key, valg.value)}
              className={[
                "w-full rounded-2xl border px-5 py-4 text-left text-lg transition-all duration-200",
                "min-h-[60px] active:scale-[0.99]",
                valgt
                  ? "border-salvie bg-salvie text-white shadow-kort"
                  : "border-salvie-lys bg-white text-koks hover:border-salvie hover:bg-salvie-lys/40",
              ].join(" ")}
              aria-pressed={valgt}
            >
              {valg.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
