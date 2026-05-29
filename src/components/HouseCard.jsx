import { useState } from "react";

// HouseCard – ett rangert hus-resultat med bilde, fakta, match-% og begrunnelse.
// Bildet hentes fra hustypens side; faller tilbake til en enkel placeholder
// dersom bildet ikke kan lastes.
export default function HouseCard({ hus, rank }) {
  const [bildeFeilet, setBildeFeilet] = useState(false);

  // Heuristisk bilde-URL basert på hustypens side. Mange WordPress-oppsett
  // eksponerer ikke et forutsigbart bilde, så vi viser en pen placeholder
  // dersom dette feiler (onError).
  const bildeUrl = `${hus.url}wp-content/uploads/${hus.navn.toLowerCase()}.jpg`;

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-kort">
      <div className="relative h-48 w-full bg-salvie-lys sm:h-56">
        {!bildeFeilet ? (
          <img
            src={bildeUrl}
            alt={`Hustype ${hus.navn}`}
            loading="lazy"
            onError={() => setBildeFeilet(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-salvie-lys text-salvie-mork">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M3 10.5 12 4l9 6.5" />
              <path d="M5 9.5V20h14V9.5" />
              <path d="M9.5 20v-5h5v5" />
            </svg>
            <span className="mt-2 text-sm font-medium">{hus.navn}</span>
          </div>
        )}

        {/* Rangeringsmerke */}
        <span className="absolute left-4 top-4 rounded-full bg-koks/85 px-3 py-1 text-xs font-semibold text-white">
          #{rank}
        </span>
        {/* Match-% badge */}
        <span className="absolute right-4 top-4 rounded-full bg-salvie px-3 py-1 text-sm font-semibold text-white shadow-kort">
          {hus.prosent}% match
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="text-xl font-semibold text-koks">{hus.navn}</h3>

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-koks/70">
          <li>{hus.m2} m²</li>
          <li>{hus.sov} soverom</li>
          <li>{hus.bad} bad</li>
          <li>
            {hus.etg} {hus.etg === 1 ? "etasje" : "etasjer"}
          </li>
        </ul>

        <p className="mt-4 text-koks/80">{hus.begrunnelse}</p>

        <a
          href={hus.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center font-medium text-salvie-mork transition-colors hover:text-salvie"
        >
          Se huset →
        </a>
      </div>
    </article>
  );
}
