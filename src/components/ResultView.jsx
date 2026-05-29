import { useState } from "react";
import Logo from "./Logo.jsx";
import LeadTable from "./LeadTable.jsx";
import PdfExport from "./PdfExport.jsx";

// ---- Hjelpere: etiketter og farger ----------------------------------------

const PROSJEKT_ETIKETT = {
  nybygg: "Nybygg",
  tilbygg: "Tilbygg",
  rehabilitering: "Rehabilitering",
  reparasjon: "Reparasjon",
  befaring: "Befaring",
  ukjent: "Ukjent prosjekttype",
};

const FLAGG_STIL = {
  info: {
    kort: "border-gray-300 bg-gray-50",
    merke: "bg-info text-white",
    etikett: "Info",
    ikon: "ℹ️",
  },
  viktig: {
    kort: "border-orange-300 bg-orange-50",
    merke: "bg-viktig text-white",
    etikett: "Viktig",
    ikon: "⚠️",
  },
  kritisk: {
    kort: "border-red-300 bg-red-50",
    merke: "bg-kritisk text-white",
    etikett: "Kritisk",
    ikon: "🛑",
  },
};

const FLAGG_TYPE_TEKST = {
  søknadsplikt: "Søknadsplikt",
  asbest: "Asbest",
  våtrom: "Våtrom",
  trenger_elektriker: "Trenger elektriker",
  trenger_rørlegger: "Trenger rørlegger",
  ansvarsrett: "Ansvarsrett",
  annet: "Merk",
};

// Liten gjenbrukbar kort-ramme.
function Kort({ children, className = "" }) {
  return (
    <section
      className={
        "avoid-break rounded-xl2 bg-white p-6 shadow-kort sm:p-7 print-block " + className
      }
    >
      {children}
    </section>
  );
}

function KortTittel({ nummer, children, accent = false }) {
  return (
    <h2 className="mb-4 flex items-center gap-3 text-2xl font-extrabold text-antrasitt">
      <span
        className={
          "grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg font-black " +
          (accent ? "bg-bygg text-antrasitt" : "bg-antrasitt text-white")
        }
      >
        {nummer}
      </span>
      {children}
    </h2>
  );
}

export default function ResultView({ resultat, onNyAnalyse }) {
  // Lokal, redigerbar kopi av tilbudslinjene + avhuking av mangler.
  const [linjer, setLinjer] = useState(resultat.tilbudsutkast.linjer);
  const [avhuket, setAvhuket] = useState({});

  const { prosjekttype, sammendrag, kunde, scope, mangler, norske_flagg, tilbudsutkast } =
    resultat;

  function leggTilLinje() {
    setLinjer((prev) => [...prev, { beskrivelse: "", mengde: "", enhet: "", pris: "" }]);
  }
  function fjernLinje(idx) {
    setLinjer((prev) => prev.filter((_, i) => i !== idx));
  }

  const kundeDeler = [
    kunde.navn,
    kunde.type && kunde.type !== "ukjent" ? `(${kunde.type})` : "",
    kunde.adresse,
    kunde.kontakt,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-lerret">
      {/* Topp-handlinger (skjules i PDF) */}
      <div className="no-print sticky top-0 z-10 border-b border-antrasitt-600 bg-antrasitt-800/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Logo />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onNyAnalyse}
              className="rounded-xl border-2 border-gray-500 bg-transparent px-5 py-3 text-lg font-bold text-white transition hover:border-white hover:bg-white/10"
            >
              Ny analyse
            </button>
            <PdfExport />
          </div>
        </div>
      </div>

      <main className="print-area mx-auto max-w-4xl px-5 py-8">
        {/* Print-header (vises kun ved utskrift) */}
        <div className="mb-6 hidden items-center justify-between border-b-4 border-bygg pb-4 print:flex">
          <span className="text-3xl font-black text-antrasitt">
            ByggPilot <span className="text-bygg">AI</span>
          </span>
          <span className="text-base text-gray-500">Prosjektgrunnlag · utkast</span>
        </div>

        <div className="stagger space-y-5">
          {/* 1 – Prosjektsammendrag */}
          <Kort>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-bygg px-4 py-1.5 text-lg font-extrabold uppercase tracking-wide text-antrasitt">
                {PROSJEKT_ETIKETT[prosjekttype] || prosjekttype}
              </span>
              <h1 className="text-2xl font-extrabold text-antrasitt sm:text-3xl">
                Prosjektsammendrag
              </h1>
            </div>
            <p className="text-xl leading-relaxed text-antrasitt-700">
              {sammendrag || "Modellen ga ikke noe sammendrag."}
            </p>
            {kundeDeler.length > 0 && (
              <div className="mt-4 rounded-xl bg-gray-50 p-4">
                <p className="text-base font-bold uppercase tracking-wide text-gray-500">
                  Kunde
                </p>
                <p className="mt-1 text-lg font-semibold text-antrasitt">
                  {kundeDeler.join(" · ")}
                </p>
              </div>
            )}
          </Kort>

          {/* 2 – Arbeidsomfang */}
          <Kort>
            <KortTittel nummer="1">Arbeidsomfang</KortTittel>
            {scope.length > 0 ? (
              <ul className="space-y-2.5">
                {scope.map((punkt, i) => (
                  <li key={i} className="flex gap-3 text-lg text-antrasitt-700">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-bygg" />
                    <span>{punkt}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-gray-400">Ingen tydelig omfang oppgitt ennå.</p>
            )}
          </Kort>

          {/* 3 – Mangler (mest verdifulle delen – fremhevet) */}
          <section className="avoid-break overflow-hidden rounded-xl2 border-2 border-bygg bg-white shadow-kort print-block">
            <div className="bg-bygg px-6 py-4">
              <h2 className="flex items-center gap-3 text-2xl font-black text-antrasitt">
                <span className="text-2xl">📋</span>
                Dette må du avklare før tilbud
              </h2>
            </div>
            <div className="p-6">
              {mangler.length > 0 ? (
                <ul className="space-y-3">
                  {mangler.map((punkt, i) => {
                    const checked = !!avhuket[i];
                    return (
                      <li key={i}>
                        <label className="flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setAvhuket((prev) => ({ ...prev, [i]: !prev[i] }))
                            }
                            className="mt-1 h-6 w-6 shrink-0 cursor-pointer accent-bygg"
                          />
                          <span
                            className={
                              "text-lg " +
                              (checked
                                ? "text-gray-400 line-through"
                                : "font-medium text-antrasitt")
                            }
                          >
                            {punkt}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-lg text-gray-500">
                  Ingen åpenbare mangler funnet – men ta alltid en befaring før du gir pris.
                </p>
              )}
            </div>
          </section>

          {/* 4 – Norske flagg */}
          {norske_flagg.length > 0 && (
            <Kort>
              <KortTittel nummer="2">Norske krav og flagg</KortTittel>
              <div className="grid gap-3 sm:grid-cols-2">
                {norske_flagg.map((flagg, i) => {
                  const stil = FLAGG_STIL[flagg.alvorlighet] || FLAGG_STIL.info;
                  return (
                    <div
                      key={i}
                      className={"avoid-break rounded-xl border-2 p-4 " + stil.kort}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-lg font-bold text-antrasitt">
                          <span aria-hidden="true">{stil.ikon}</span>
                          {FLAGG_TYPE_TEKST[flagg.type] || flagg.type}
                        </span>
                        <span
                          className={
                            "rounded-full px-3 py-0.5 text-sm font-bold uppercase " + stil.merke
                          }
                        >
                          {stil.etikett}
                        </span>
                      </div>
                      <p className="text-lg leading-snug text-antrasitt-700">{flagg.tekst}</p>
                    </div>
                  );
                })}
              </div>
            </Kort>
          )}

          {/* 5 – Tilbudsutkast */}
          <Kort>
            <KortTittel nummer="3" accent>
              Tilbudsutkast
            </KortTittel>
            {tilbudsutkast.tittel && (
              <p className="mb-4 text-xl font-bold text-antrasitt">{tilbudsutkast.tittel}</p>
            )}
            <p className="mb-4 rounded-xl bg-bygg/10 p-3 text-base font-semibold text-bygg-mork no-print">
              Mengde og pris er bevisst tomme – fyll inn dine egne tall. ByggPilot gjetter aldri pris.
            </p>

            <LeadTable
              linjer={linjer}
              onEndre={setLinjer}
              onLeggTil={leggTilLinje}
              onFjern={fjernLinje}
            />

            {tilbudsutkast.forbehold.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 text-xl font-bold text-antrasitt">Forbehold</h3>
                <ul className="space-y-1.5">
                  {tilbudsutkast.forbehold.map((f, i) => (
                    <li key={i} className="flex gap-2 text-base text-antrasitt-700">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Kort>

          {/* Bunntekst / framing */}
          <p className="px-2 pb-4 pt-2 text-center text-base text-gray-400">
            Utkast generert av ByggPilot AI · et tilbuds-klart grunnlag og en sjekkliste, ikke et
            ferdig prissatt tilbud. Håndverkeren beholder kontrollen over pris og tid.
          </p>
        </div>
      </main>
    </div>
  );
}
