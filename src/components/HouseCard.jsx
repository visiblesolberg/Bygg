import { useEffect, useState } from "react";

// Bildekilder, i prioritert rekkefølge:
//  1. Lokalt bilde lagt i public/houses/<slug>.jpg (mest robust – ingen CORS).
//  2. Hustype-sidens "featured image" via WordPress REST API (hvis CORS tillater).
//  3. Pen placeholder med hus-ikon.
const REST_BASE = "https://lillesandhus.no/wp-json/wp/v2";

// Slug = siste segment i url-en, f.eks. ".../homborsund/" → "homborsund".
function slugFromUrl(url) {
  return url.replace(/\/+$/, "").split("/").pop();
}

// Lokal sti til et nedlastet bilde (legg filene i public/houses/).
function localBilde(slug) {
  return `${import.meta.env.BASE_URL}houses/${slug}.jpg`;
}

// Velg en passe stor bildevariant fra media-objektet (faller tilbake til full).
function bestBilde(media) {
  const sizes = media?.media_details?.sizes;
  return (
    sizes?.large?.source_url ||
    sizes?.medium_large?.source_url ||
    sizes?.medium?.source_url ||
    media?.source_url ||
    null
  );
}

// HouseCard – ett rangert hus-resultat med bilde, fakta, match-% og begrunnelse.
export default function HouseCard({ hus, rank }) {
  const slug = slugFromUrl(hus.url);

  // Liste over bildekilder vi prøver i tur og orden. Starter med lokalt bilde;
  // WordPress-bildet legges til når/hvis REST-kallet lykkes.
  const [kilder, setKilder] = useState([localBilde(slug)]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let avbrutt = false;

    async function hentWpBilde() {
      try {
        const res = await fetch(
          `${REST_BASE}/pages?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const media = data?.[0]?._embedded?.["wp:featuredmedia"]?.[0];
        const url = bestBilde(media);
        // Legg WordPress-bildet bakerst som reserve etter det lokale bildet.
        if (url && !avbrutt) setKilder((k) => (k.includes(url) ? k : [...k, url]));
      } catch {
        /* ignorer – vi har lokalt bilde / placeholder som reserve */
      }
    }

    hentWpBilde();
    return () => {
      avbrutt = true;
    };
  }, [slug]);

  const aktivKilde = idx < kilder.length ? kilder[idx] : null;

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-kort transition-shadow hover:shadow-lg">
      <div className="relative h-48 w-full bg-salvie-lys sm:h-56">
        {aktivKilde ? (
          <img
            src={aktivKilde}
            alt={`Hustype ${hus.navn}`}
            loading="lazy"
            onError={() => setIdx((i) => i + 1)}
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
