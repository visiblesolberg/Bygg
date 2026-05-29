import { useEffect, useState } from "react";

// Henter den ekte hustype-siden sin "featured image" via WordPress REST API.
// LillesandHus kjører WordPress, som eksponerer /wp-json med åpne CORS-headere
// for GET. Vi slår opp siden på slug og leser ut bildet. Alt skjer i
// besøkendes nettleser (sandbox-miljøet vårt når ikke lillesandhus.no).
const REST_BASE = "https://lillesandhus.no/wp-json/wp/v2";

// Slug = siste segment i url-en, f.eks. ".../homborsund/" → "homborsund".
function slugFromUrl(url) {
  return url.replace(/\/+$/, "").split("/").pop();
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

// HouseCard – ett rangert hus-resultat med ekte bilde, fakta, match-% og begrunnelse.
export default function HouseCard({ hus, rank }) {
  const [bildeUrl, setBildeUrl] = useState(null);
  const [bildeFeilet, setBildeFeilet] = useState(false);

  useEffect(() => {
    let avbrutt = false;
    const slug = slugFromUrl(hus.url);

    async function hentBilde() {
      try {
        const res = await fetch(
          `${REST_BASE}/pages?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const media = data?.[0]?._embedded?.["wp:featuredmedia"]?.[0];
        const url = bestBilde(media);
        if (!avbrutt) {
          if (url) setBildeUrl(url);
          else setBildeFeilet(true);
        }
      } catch {
        if (!avbrutt) setBildeFeilet(true);
      }
    }

    hentBilde();
    return () => {
      avbrutt = true;
    };
  }, [hus.url]);

  const visBilde = bildeUrl && !bildeFeilet;

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-kort">
      <div className="relative h-48 w-full bg-salvie-lys sm:h-56">
        {visBilde ? (
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
