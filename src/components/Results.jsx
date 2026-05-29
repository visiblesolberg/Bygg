import HouseCard from "./HouseCard.jsx";
import LeadForm from "./LeadForm.jsx";

// Results – resultatskjermen: topp-3 hus, lead-skjema og sekundær CTA.
export default function Results({ topp3, svar, onRestart }) {
  return (
    <div className="fade-in mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-salvie">
          Ditt hus – dine løsninger
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-koks sm:text-4xl">
          Vi fant 3 hus som passer deg
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-koks/70">
          Basert på svarene dine har vi rangert hustypene som matcher best. Klikk
          deg inn på hver enkelt for å se mer.
        </p>
      </div>

      {/* Tre rangerte kort */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {topp3.map((hus, i) => (
          <HouseCard key={hus.navn} hus={hus} rank={i + 1} />
        ))}
      </div>

      {/* Lead-skjema */}
      <div className="mt-12">
        <LeadForm svar={svar} topp3={topp3} />
      </div>

      {/* Sekundær CTA + start på nytt */}
      <div className="mt-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between">
        <a
          href="https://lillesandhus.no/bestill-katalog/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-salvie px-6 py-3 font-medium text-salvie-mork transition-colors hover:bg-salvie-lys/50"
        >
          Bestill huskatalog
        </a>
        <button
          type="button"
          onClick={onRestart}
          className="text-koks/60 underline-offset-4 transition-colors hover:text-koks hover:underline"
        >
          ↺ Start på nytt
        </button>
      </div>
    </div>
  );
}
