import { useRef, useState } from "react";
import Logo from "./Logo.jsx";
import { slaOppOrgnr } from "../lib/brreg.js";
import { EKSEMPEL_TEKST, EKSEMPEL_BILDE_HINT } from "../lib/example.js";

// Hjelper: del opp valgte filer i bilder og PDF-er.
function sorterFiler(filListe) {
  const bilder = [];
  const pdfer = [];
  for (const f of filListe) {
    if (f.type === "application/pdf" || /\.pdf$/i.test(f.name)) pdfer.push(f);
    else if (f.type.startsWith("image/")) bilder.push(f);
  }
  return { bilder, pdfer };
}

export default function IntakeScreen({ onAnalyser, startfeil }) {
  const [tekst, setTekst] = useState("");
  const [filer, setFiler] = useState([]); // { fil, url?, type }
  const [orgnr, setOrgnr] = useState("");
  const [drager, setDrager] = useState(false);
  const [brregInfo, setBrregInfo] = useState(null);
  const [brregFeil, setBrregFeil] = useState("");
  const [brregLaster, setBrregLaster] = useState(false);
  const inputRef = useRef(null);

  function leggTilFiler(filListe) {
    const { bilder, pdfer } = sorterFiler(Array.from(filListe));
    const nye = [
      ...bilder.map((fil) => ({ fil, url: URL.createObjectURL(fil), type: "bilde" })),
      ...pdfer.map((fil) => ({ fil, url: null, type: "pdf" })),
    ];
    setFiler((prev) => [...prev, ...nye]);
  }

  function fjernFil(idx) {
    setFiler((prev) => {
      const kopi = [...prev];
      const [fjernet] = kopi.splice(idx, 1);
      if (fjernet?.url) URL.revokeObjectURL(fjernet.url);
      return kopi;
    });
  }

  async function sjekkBrreg() {
    setBrregFeil("");
    setBrregInfo(null);
    if (!orgnr.trim()) return;
    setBrregLaster(true);
    const res = await slaOppOrgnr(orgnr);
    setBrregLaster(false);
    if (res.funnet) setBrregInfo(res);
    else setBrregFeil(res.feil || "Oppslag ga ingen treff.");
  }

  function prøvEksempel() {
    setTekst(EKSEMPEL_TEKST);
  }

  function kjørAnalyse() {
    const bilder = filer.filter((f) => f.type === "bilde").map((f) => f.fil);
    const pdfer = filer.filter((f) => f.type === "pdf").map((f) => f.fil);
    onAnalyser({ tekst, bilder, pdfer, brregInfo });
  }

  const harInnhold = tekst.trim().length > 0 || filer.length > 0;

  return (
    <div className="fade-in mx-auto max-w-3xl px-5 pb-20 pt-8 sm:pt-12">
      {/* Header */}
      <header className="text-center">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-xl font-medium text-gray-300 sm:text-2xl">
          Fra rotete henvendelse til tilbuds-klart utkast — på sekunder.
        </p>
      </header>

      {/* Inntakskort */}
      <div className="mt-10 rounded-xl2 bg-white p-6 shadow-kort sm:p-8">
        <label htmlFor="melding" className="block text-2xl font-bold text-antrasitt">
          Lim inn kundens melding her
        </label>
        <p className="mt-1 text-lg text-gray-500">
          Hele meldingen – rotete er helt greit. ByggPilot rydder.
        </p>

        <textarea
          id="melding"
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          rows={6}
          placeholder="«Hei, kjøkkenet mitt er ødelagt, kan dere fikse det?»"
          className="mt-4 w-full resize-y rounded-xl border-2 border-gray-200 bg-gray-50 p-4 text-lg leading-relaxed text-antrasitt placeholder:text-gray-400 focus:border-bygg focus:bg-white focus:outline-none focus:ring-4 focus:ring-bygg/20"
        />

        {/* Opplasting */}
        <div className="mt-6">
          <span className="block text-xl font-bold text-antrasitt">
            Bilder og PDF fra kunden
          </span>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrager(true);
            }}
            onDragLeave={() => setDrager(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrager(false);
              if (e.dataTransfer.files?.length) leggTilFiler(e.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
            className={
              "mt-3 cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors " +
              (drager
                ? "border-bygg bg-bygg/5"
                : "border-gray-300 bg-gray-50 hover:border-bygg hover:bg-bygg/5")
            }
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,application/pdf"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) leggTilFiler(e.target.files);
                e.target.value = "";
              }}
            />
            <p className="text-lg font-semibold text-antrasitt">
              Dra & slipp filer her, eller <span className="text-bygg">klikk for å velge</span>
            </p>
            <p className="mt-1 text-base text-gray-500">JPG, PNG eller PDF</p>
          </div>
          <p className="mt-2 text-base text-gray-400">{EKSEMPEL_BILDE_HINT}</p>

          {/* Thumbnails */}
          {filer.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {filer.map((f, idx) => (
                <div
                  key={idx}
                  className="group relative h-24 w-24 overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-100"
                >
                  {f.type === "bilde" ? (
                    <img src={f.url} alt={f.fil.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-red-50 p-1 text-center">
                      <span className="text-2xl">📄</span>
                      <span className="mt-1 line-clamp-2 text-xs font-semibold text-red-700">
                        {f.fil.name}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fjernFil(idx);
                    }}
                    className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-antrasitt/80 text-base font-bold text-white opacity-90 transition hover:bg-kritisk"
                    aria-label={`Fjern ${f.fil.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orgnr / brreg */}
        <div className="mt-6">
          <label htmlFor="orgnr" className="block text-xl font-bold text-antrasitt">
            Kundens orgnr <span className="font-normal text-gray-500">(hvis bedrift)</span>
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id="orgnr"
              value={orgnr}
              onChange={(e) => setOrgnr(e.target.value)}
              inputMode="numeric"
              placeholder="9 siffer, f.eks. 923 609 016"
              className="flex-1 rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-lg text-antrasitt placeholder:text-gray-400 focus:border-bygg focus:bg-white focus:outline-none focus:ring-4 focus:ring-bygg/20"
            />
            <button
              type="button"
              onClick={sjekkBrreg}
              disabled={brregLaster}
              className="rounded-xl border-2 border-antrasitt bg-white px-5 py-3 text-lg font-bold text-antrasitt transition hover:bg-antrasitt hover:text-white disabled:opacity-50"
            >
              {brregLaster ? "Slår opp…" : "Slå opp i Brreg"}
            </button>
          </div>

          {brregInfo && (
            <div className="mt-3 rounded-xl border-2 border-green-200 bg-green-50 p-4">
              <p className="text-lg font-bold text-green-800">✓ {brregInfo.navn}</p>
              <p className="text-base text-green-700">
                {[brregInfo.organisasjonsform, brregInfo.adresse].filter(Boolean).join(" · ")}
                {brregInfo.antallAnsatte != null && ` · ${brregInfo.antallAnsatte} ansatte`}
              </p>
            </div>
          )}
          {brregFeil && (
            <p className="mt-3 rounded-xl bg-gray-100 p-3 text-base text-gray-600">{brregFeil}</p>
          )}
        </div>

        {startfeil && (
          <div className="mt-6 rounded-xl border-2 border-red-200 bg-red-50 p-4">
            <p className="text-lg font-semibold text-red-700">{startfeil}</p>
          </div>
        )}

        {/* Handlinger */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse">
          <button
            type="button"
            onClick={kjørAnalyse}
            disabled={!harInnhold}
            className="flex-1 rounded-xl bg-bygg px-6 py-4 text-xl font-extrabold text-antrasitt shadow-aksent transition hover:bg-bygg-mork hover:text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
          >
            Analyser henvendelsen →
          </button>
          <button
            type="button"
            onClick={prøvEksempel}
            className="rounded-xl border-2 border-gray-300 bg-white px-6 py-4 text-lg font-bold text-antrasitt transition hover:border-antrasitt"
          >
            Prøv et eksempel
          </button>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-base text-gray-400">
        ByggPilot lager et <span className="font-semibold text-gray-300">tilbuds-klart utkast og en sjekkliste</span> —
        ikke et ferdig prissatt tilbud. Du beholder kontrollen over pris og tid.
      </p>
    </div>
  );
}
