import { useState } from "react";
import { postLead } from "../lib/leads.js";

// LeadForm – det viktigste konverteringspunktet. Samler kontaktinfo og sender
// inn et komplett lead-objekt (inkl. et skjult sammendrag av svar + topp-3).
export default function LeadForm({ svar, topp3 }) {
  const [felter, setFelter] = useState({
    navn: "",
    epost: "",
    telefon: "",
    kommune: "",
    fritekst: "",
  });
  const [feil, setFeil] = useState({});
  const [sendt, setSendt] = useState(false);
  const [sender, setSender] = useState(false);

  function endre(e) {
    const { name, value } = e.target;
    setFelter((f) => ({ ...f, [name]: value }));
    setFeil((f) => ({ ...f, [name]: undefined }));
  }

  function valider() {
    const f = {};
    if (!felter.navn.trim()) f.navn = "Fyll inn navnet ditt.";
    if (!felter.epost.trim()) {
      f.epost = "Fyll inn e-postadressen din.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(felter.epost.trim())) {
      f.epost = "Sjekk at e-postadressen er gyldig.";
    }
    if (!felter.telefon.trim()) f.telefon = "Fyll inn telefonnummeret ditt.";
    if (!felter.kommune.trim()) f.kommune = "Fyll inn kommunen din.";
    return f;
  }

  async function send(e) {
    e.preventDefault();
    const f = valider();
    if (Object.keys(f).length) {
      setFeil(f);
      return;
    }

    setSender(true);

    // Skjult sammendrag av svarene + topp-3-match bakes inn i leadet.
    const lead = {
      navn: felter.navn.trim(),
      epost: felter.epost.trim(),
      telefon: felter.telefon.trim(),
      kommune: felter.kommune.trim(),
      fritekst: felter.fritekst.trim(),
      tomt: svar.tomt, // "ja" | "trenger-hjelp" – viktig kvalifiserer
      svar: {
        husstand: svar.husstand,
        soverom: svar.soverom,
        bad: svar.bad,
        etasjer: svar.etasjer,
        storrelse: svar.storrelse,
      },
      topp3: topp3.map((h) => ({
        navn: h.navn,
        matchProsent: h.prosent,
        url: h.url,
      })),
    };

    await postLead(lead);
    setSender(false);
    setSendt(true);
  }

  if (sendt) {
    return (
      <div className="fade-in rounded-3xl bg-salvie-lys p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-salvie text-white">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m5 13 4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-koks">Takk!</h3>
        <p className="mt-2 text-koks/80">
          En av våre fagfolk tar kontakt snart. Vi gleder oss til å høre om
          drømmehuset ditt.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={send} noValidate className="rounded-3xl bg-white p-6 shadow-kort sm:p-8">
      <h3 className="text-2xl font-semibold text-koks">Snakk med en fagperson</h3>
      <p className="mt-2 text-koks/70">
        Legg igjen kontaktinfo, så tar en av våre fagfolk en uforpliktende prat
        med deg om mulighetene.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Felt label="Navn" name="navn" value={felter.navn} onChange={endre} feil={feil.navn} autoComplete="name" />
        <Felt label="Kommune" name="kommune" value={felter.kommune} onChange={endre} feil={feil.kommune} autoComplete="address-level2" />
        <Felt label="E-post" name="epost" type="email" value={felter.epost} onChange={endre} feil={feil.epost} autoComplete="email" />
        <Felt label="Telefon" name="telefon" type="tel" value={felter.telefon} onChange={endre} feil={feil.telefon} autoComplete="tel" />
      </div>

      <div className="mt-4">
        <label htmlFor="fritekst" className="mb-1 block text-sm font-medium text-koks/80">
          Fortell oss om drømmehuset ditt
        </label>
        <textarea
          id="fritekst"
          name="fritekst"
          rows={3}
          value={felter.fritekst}
          onChange={endre}
          className="w-full rounded-xl border border-salvie-lys bg-krem/40 px-4 py-3 text-koks outline-none transition-colors focus:border-salvie"
          placeholder="F.eks. ønsker, tomt, tidsplan …"
        />
      </div>

      <button
        type="submit"
        disabled={sender}
        className="mt-6 w-full rounded-full bg-salvie px-6 py-4 text-lg font-semibold text-white shadow-kort transition-all hover:bg-salvie-mork active:scale-[0.99] disabled:opacity-60"
      >
        {sender ? "Sender …" : "Få en uforpliktende prat med en av våre fagfolk"}
      </button>
    </form>
  );
}

// Lite gjenbrukbart input-felt med label og feilmelding.
function Felt({ label, name, value, onChange, feil, type = "text", autoComplete }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-koks/80">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={!!feil}
        className={[
          "w-full rounded-xl border bg-krem/40 px-4 py-3 text-koks outline-none transition-colors",
          feil ? "border-red-400 focus:border-red-500" : "border-salvie-lys focus:border-salvie",
        ].join(" ")}
      />
      {feil && <p className="mt-1 text-sm text-red-500">{feil}</p>}
    </div>
  );
}
