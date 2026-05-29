// =============================================================================
// ByggPilot AI – Claude-kall + trygg JSON-parsing
// -----------------------------------------------------------------------------
// Her ligger HELE kjernen: vi sender kundens tekst + bilder (+ ev. PDF) til
// Claude, og ber om strukturert JSON tilbake etter et fast skjema.
//
// MODELL:  endres i ÉN konstant under (MODELL).
// SYSTEM:  systeminstruksen (SYSTEM_PROMPT) styrer hva ByggPilot kan/ikke kan.
//          Juster den der for å endre oppførsel.
// =============================================================================

// Modellen kan byttes her. Sonnet er rask og multimodal – passer demoen.
export const MODELL = "claude-sonnet-4-20250514";

const API_URL = "https://api.anthropic.com/v1/messages";
const API_VERSION = "2023-06-01";

// -----------------------------------------------------------------------------
// SYSTEMINSTRUKS – ByggPilots "hjerne".
// -----------------------------------------------------------------------------
export const SYSTEM_PROMPT = `Du er ByggPilot – en erfaren norsk byggeleder og kalkulatør-assistent.
Jobben din er å rydde en rotete kundehenvendelse (tekst, bilder og ev. PDF) til et
strukturert, tilbuds-klart UTKAST for en norsk håndverker eller byggmester.

VIKTIGE REGLER:
- Du lager ALDRI et ferdig prissatt tilbud. Du gjetter ALDRI priser, mengder eller mål
  du ikke faktisk kan se eller som ikke er oppgitt. Alle pris- og mengdefelt skal være TOMME.
- Skill tydelig mellom det som er STATED (sagt i teksten eller synlig på bilder) og det som MANGLER.
- "mangler" er den viktigste delen: list konkret det håndverkeren MÅ avklare før han kan
  gi tilbud (befaring, nøyaktige mål, tilkomst/adkomst, tidsramme, budsjett, hvem som er
  beslutningstaker, eksisterende tilstand, materialvalg osv.).
- Kjenn norske byggekrav og flagg dem når de er relevante:
  * Søknadsplikt / byggesak (tilbygg, bruksendring, bærende konstruksjon, fasadeendring).
  * Ansvarsrett og krav om ansvarlig foretak ved søknadspliktige tiltak.
  * Asbest: bygg oppført før ~1990 kan inneholde asbest (eternitt, rørisolasjon, lim) –
    flagg kartlegging før riving.
  * Våtromsnormen (Byggebransjens våtromsnorm) ved bad/våtrom.
  * En tømrer kan IKKE utføre elektriker- eller rørleggerarbeid selv – disse fagene krever
    godkjent foretak. Flagg "trenger_elektriker" / "trenger_rørlegger" når relevant.
  * TEK17-krav (f.eks. rømningsvei, brann, energi, fukt) der det er åpenbart relevant.
- Vær konkret, nøktern og praktisk – som en erfaren bas som vil hjelpe en kollega.
- All tekst skal være på norsk (bokmål).

SVAR KUN med gyldig JSON som matcher skjemaet nedenfor. Ingen markdown, ingen kodeblokk,
ingen forklaring før eller etter. Bruk tomme strenger/arrays der du mangler informasjon.

SKJEMA:
{
  "prosjekttype": "nybygg | tilbygg | rehabilitering | reparasjon | befaring | ukjent",
  "sammendrag": "2-4 setningers prosjektsammendrag på norsk",
  "kunde": { "navn": "", "type": "privat | bedrift | ukjent", "adresse": "", "kontakt": "" },
  "scope": ["punktvis det som er sagt/synlig — ikke antatt"],
  "mangler": ["info håndverkeren MÅ innhente før tilbud"],
  "norske_flagg": [
    { "type": "søknadsplikt | asbest | våtrom | trenger_elektriker | trenger_rørlegger | ansvarsrett | annet",
      "tekst": "kort forklaring på norsk", "alvorlighet": "info | viktig | kritisk" }
  ],
  "tilbudsutkast": {
    "tittel": "",
    "linjer": [ { "beskrivelse": "arbeidslinje", "mengde": "", "enhet": "", "pris": "" } ],
    "forbehold": ["standard norske forbehold — pris forutsetter befaring osv."]
  }
}`;

// -----------------------------------------------------------------------------
// API-nøkkel. Holdes UTENFOR koden – leses fra Vite-miljøvariabel (.env).
//   VITE_ANTHROPIC_API_KEY=sk-ant-...
// (Se README. For produksjon bør kallet flyttes bak et eget backend-endepunkt.)
// -----------------------------------------------------------------------------
function hentApiNokkel() {
  return import.meta.env.VITE_ANTHROPIC_API_KEY || "";
}

// Leser en File til en ren base64-streng (uten "data:...;base64,"-prefiks).
export function filTilBase64(fil) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const komma = result.indexOf(",");
      resolve(komma >= 0 ? result.slice(komma + 1) : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(fil);
  });
}

// Fjerner ev. ```json ... ``` fences og henter ut det første {...}-objektet.
export function parseClaudeJson(raw) {
  if (!raw || typeof raw !== "string") {
    throw new Error("Tomt svar fra modellen.");
  }
  let tekst = raw.trim();

  // Strip kodeblokk-fences hvis modellen likevel la dem på.
  tekst = tekst.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  // Fall tilbake til å klippe ut det ytterste JSON-objektet.
  if (!tekst.startsWith("{")) {
    const start = tekst.indexOf("{");
    const slutt = tekst.lastIndexOf("}");
    if (start >= 0 && slutt > start) {
      tekst = tekst.slice(start, slutt + 1);
    }
  }

  return JSON.parse(tekst);
}

// Gir et trygt, fullt utfylt objekt selv om modellen utelater felter.
export function normaliserResultat(data) {
  const d = data || {};
  const kunde = d.kunde || {};
  const utkast = d.tilbudsutkast || {};
  return {
    prosjekttype: d.prosjekttype || "ukjent",
    sammendrag: d.sammendrag || "",
    kunde: {
      navn: kunde.navn || "",
      type: kunde.type || "ukjent",
      adresse: kunde.adresse || "",
      kontakt: kunde.kontakt || "",
    },
    scope: Array.isArray(d.scope) ? d.scope.filter(Boolean) : [],
    mangler: Array.isArray(d.mangler) ? d.mangler.filter(Boolean) : [],
    norske_flagg: Array.isArray(d.norske_flagg)
      ? d.norske_flagg
          .filter((f) => f && (f.tekst || f.type))
          .map((f) => ({
            type: f.type || "annet",
            tekst: f.tekst || "",
            alvorlighet: ["info", "viktig", "kritisk"].includes(f.alvorlighet)
              ? f.alvorlighet
              : "info",
          }))
      : [],
    tilbudsutkast: {
      tittel: utkast.tittel || "",
      linjer: Array.isArray(utkast.linjer)
        ? utkast.linjer.map((l) => ({
            beskrivelse: (l && l.beskrivelse) || "",
            mengde: (l && l.mengde) || "",
            enhet: (l && l.enhet) || "",
            pris: (l && l.pris) || "",
          }))
        : [],
      forbehold: Array.isArray(utkast.forbehold)
        ? utkast.forbehold.filter(Boolean)
        : [],
    },
  };
}

// -----------------------------------------------------------------------------
// Hovedfunksjon: analyser henvendelsen.
//   { tekst, bilder: File[], pdfer: File[], brregInfo? }  ->  normalisert resultat
// -----------------------------------------------------------------------------
export async function analyserHenvendelse({ tekst, bilder = [], pdfer = [], brregInfo = null }) {
  const apiKey = hentApiNokkel();
  if (!apiKey) {
    throw new Error(
      "Mangler API-nøkkel. Legg VITE_ANTHROPIC_API_KEY i en .env-fil (se README) og start dev-serveren på nytt."
    );
  }

  // Bygg innholds-blokkene til meldingen.
  const content = [];

  // 1) Bilder som image-blocks (base64).
  for (const fil of bilder) {
    try {
      const data = await filTilBase64(fil);
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: fil.type || "image/jpeg",
          data,
        },
      });
    } catch {
      // Hopp over bilder som ikke kan leses – ikke blokker demoen.
    }
  }

  // 2) PDF-er som document-blocks (Claude leser PDF direkte).
  for (const fil of pdfer) {
    try {
      const data = await filTilBase64(fil);
      content.push({
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data,
        },
      });
    } catch {
      // ignorer ulesbar PDF
    }
  }

  // 3) Selve teksten + ev. brreg-kontekst.
  let brukerTekst = `Her er kundens henvendelse. Rydd den til et tilbuds-klart utkast etter skjemaet.\n\n`;
  brukerTekst += `KUNDENS MELDING:\n${tekst?.trim() || "(ingen tekst – se vedlegg)"}\n`;

  if (bilder.length > 0) {
    brukerTekst += `\nDet er lagt ved ${bilder.length} bilde(r) – bruk dem til å beskrive synlig omfang og tilstand.`;
  }
  if (pdfer.length > 0) {
    brukerTekst += `\nDet er lagt ved ${pdfer.length} PDF-dokument(er) – les dem hvis mulig.`;
  }
  if (brregInfo) {
    brukerTekst += `\n\nVERIFISERTE BEDRIFTSOPPLYSNINGER FRA BRØNNØYSUNDREGISTRENE (forhåndsutfyll "kunde", type=bedrift):\n`;
    brukerTekst += `Navn: ${brregInfo.navn || ""}\nOrgnr: ${brregInfo.orgnr || ""}\nAdresse: ${brregInfo.adresse || ""}\nOrganisasjonsform: ${brregInfo.organisasjonsform || ""}`;
    if (brregInfo.antallAnsatte != null) brukerTekst += `\nAntall ansatte: ${brregInfo.antallAnsatte}`;
  }
  brukerTekst += `\n\nSvar KUN med gyldig JSON etter skjemaet. Ingen markdown.`;

  content.push({ type: "text", text: brukerTekst });

  // Selve API-kallet (direkte fra browseren – krever browser-access-header).
  let res;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": API_VERSION,
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: MODELL,
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content }],
      }),
    });
  } catch (e) {
    throw new Error("Fikk ikke kontakt med Claude-API-et. Sjekk nettforbindelsen og prøv igjen.");
  }

  if (!res.ok) {
    let detalj = "";
    try {
      const feil = await res.json();
      detalj = feil?.error?.message || "";
    } catch {
      /* ignore */
    }
    throw new Error(
      `Claude-API svarte med feil (${res.status}). ${detalj}`.trim()
    );
  }

  const json = await res.json();
  const raw = json?.content?.[0]?.text || "";
  const parsed = parseClaudeJson(raw); // kaster ved ugyldig JSON
  return normaliserResultat(parsed);
}
