// =============================================================================
// Brønnøysundregistrene – enkelt oppslag på organisasjonsnummer.
// Kalles direkte fra klienten mot det åpne Enhetsregisteret-API-et.
// Feil/ikke funnet skal ALDRI krasje appen – vi returnerer { funnet: false }.
// =============================================================================

const BASE = "https://data.brreg.no/enhetsregisteret/api/enheter";

// Trekker ut kun sifre og sjekker at det er nøyaktig 9.
export function gyldigOrgnr(input) {
  const sifre = String(input || "").replace(/\D/g, "");
  return sifre.length === 9 ? sifre : null;
}

function formaterAdresse(adr) {
  if (!adr) return "";
  const linjer = Array.isArray(adr.adresse) ? adr.adresse.filter(Boolean) : [];
  const sted = [adr.postnummer, adr.poststed].filter(Boolean).join(" ");
  return [...linjer, sted].filter(Boolean).join(", ");
}

// Slår opp orgnr. Returnerer et enkelt, normalisert objekt.
export async function slaOppOrgnr(input) {
  const orgnr = gyldigOrgnr(input);
  if (!orgnr) {
    return { funnet: false, feil: "Ugyldig organisasjonsnummer (må være 9 siffer)." };
  }

  try {
    const res = await fetch(`${BASE}/${orgnr}`, {
      headers: { accept: "application/json" },
    });

    if (res.status === 404) {
      return { funnet: false, feil: "Fant ingen virksomhet med dette orgnummeret." };
    }
    if (!res.ok) {
      return { funnet: false, feil: `Oppslag feilet (${res.status}).` };
    }

    const d = await res.json();
    return {
      funnet: true,
      orgnr,
      navn: d.navn || "",
      organisasjonsform: d.organisasjonsform?.beskrivelse || "",
      antallAnsatte: typeof d.antallAnsatte === "number" ? d.antallAnsatte : null,
      adresse: formaterAdresse(d.forretningsadresse || d.beliggenhetsadresse),
      konkurs: !!d.konkurs,
    };
  } catch {
    return { funnet: false, feil: "Fikk ikke kontakt med Brønnøysund. Prøv igjen senere." };
  }
}
