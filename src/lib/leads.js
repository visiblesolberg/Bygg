// =============================================================================
// leads.js – all lead-håndtering, forhandler-ruting og SureContact-forberedelse.
//
// MVP-trygt: ingen ekte API-nøkler i koden. postLead() logger leadet til
// konsollen så demoen virker uten backend, men er strukturert slik at det er
// rett frem å koble på et serverless-endpoint mot SureContact senere.
// =============================================================================

// -----------------------------------------------------------------------------
// Kommune → forhandler-oppslag.
// Lett redigerbart objekt. Nøkler er kommunenavn i små bokstaver.
// TODO: bekreft full kommune→forhandler-mapping med LillesandHus.
// -----------------------------------------------------------------------------
export const FORHANDLER_MAP = {
  // --- Agder (LillesandHus Agder) ---
  lillesand: "LillesandHus Agder",
  kristiansand: "LillesandHus Agder",
  grimstad: "LillesandHus Agder",
  arendal: "LillesandHus Agder",
  tvedestrand: "LillesandHus Agder",
  birkenes: "LillesandHus Agder",
  vegårshei: "LillesandHus Agder",
  froland: "LillesandHus Agder",
  lindesnes: "LillesandHus Agder",
  søgne: "LillesandHus Agder",
  mandal: "LillesandHus Agder",
  farsund: "LillesandHus Agder",
  flekkefjord: "LillesandHus Agder",
  vennesla: "LillesandHus Agder",
  iveland: "LillesandHus Agder",
  evje: "LillesandHus Agder",
  "evje og hornnes": "LillesandHus Agder",
  åmli: "LillesandHus Agder",
  bygland: "LillesandHus Agder",
  valle: "LillesandHus Agder",
  bykle: "LillesandHus Agder",
  åseral: "LillesandHus Agder",
  kvinesdal: "LillesandHus Agder",
  hægebostad: "LillesandHus Agder",
  lyngdal: "LillesandHus Agder",
  sirdal: "LillesandHus Agder",
  gjerstad: "LillesandHus Agder",
  risør: "LillesandHus Agder",

  // --- Østlandet / Viken (Viken-3 Bygg AS) ---
  oslo: "Viken-3 Bygg AS",
  bærum: "Viken-3 Bygg AS",
  asker: "Viken-3 Bygg AS",
  drammen: "Viken-3 Bygg AS",
  lillestrøm: "Viken-3 Bygg AS",
  lørenskog: "Viken-3 Bygg AS",
  fredrikstad: "Viken-3 Bygg AS",
  sarpsborg: "Viken-3 Bygg AS",
  moss: "Viken-3 Bygg AS",
  halden: "Viken-3 Bygg AS",
  "nordre follo": "Viken-3 Bygg AS",
  ås: "Viken-3 Bygg AS",
  ringerike: "Viken-3 Bygg AS",
  kongsberg: "Viken-3 Bygg AS",
  tønsberg: "Viken-3 Bygg AS",
  sandefjord: "Viken-3 Bygg AS",
  larvik: "Viken-3 Bygg AS",
  horten: "Viken-3 Bygg AS",
  skien: "Viken-3 Bygg AS",
  porsgrunn: "Viken-3 Bygg AS",
  kragerø: "Viken-3 Bygg AS",
};

export const DEFAULT_FORHANDLER = "LillesandHus Agder";

// -----------------------------------------------------------------------------
// routeForhandler(kommune) → forhandlernavn.
// Normaliserer input (trim + små bokstaver) og slår opp i FORHANDLER_MAP.
// Faller tilbake til DEFAULT_FORHANDLER ved ukjent/ingen kommune.
// -----------------------------------------------------------------------------
export function routeForhandler(kommune) {
  if (!kommune) return DEFAULT_FORHANDLER;
  const nokkel = kommune.trim().toLowerCase();
  return FORHANDLER_MAP[nokkel] || DEFAULT_FORHANDLER;
}

// -----------------------------------------------------------------------------
// buildTags(lead) → array av SureContact-tagger for segmentering/ruting.
// -----------------------------------------------------------------------------
export function buildTags(lead) {
  return [
    "husmatcher",
    "forhandler:" + lead.forhandler,
    "kommune:" + (lead.kommune || "ukjent"),
    "tomt:" + lead.tomt,
    "topphus:" + (lead.topp3?.[0]?.navn || "ukjent"),
  ];
}

// -----------------------------------------------------------------------------
// postLead(lead) – eneste inngang for å sende inn et lead.
// I MVP logger den leadet (komplett med forhandler + tags) til konsollen.
// Returnerer det ferdig berikede lead-objektet.
// -----------------------------------------------------------------------------
export async function postLead(lead) {
  // Berik leadet med ruting og tags før utsending.
  const beriket = {
    ...lead,
    forhandler: routeForhandler(lead.kommune),
    kilde: "husmatcher-web",
    tidspunkt: new Date().toISOString(),
  };
  beriket.tags = buildTags(beriket);

  // MVP: alltid logg, så demoen virker uten nøkler/backend.
  console.log("[husmatcher] Nytt lead:", beriket);

  // === SureContact-integrasjon (aktiver når backend-endpoint er klart) ===
  // Lead sendes til et eget backend-/serverless-endpoint som holder API-nøkkelen
  // hemmelig. Endpointet oppretter/oppdaterer kontakt i SureContact og setter tags.
  //
  // await fetch("/api/lead", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(beriket)
  // });
  //
  // Backend (eget repo/serverless) gjør så mot SureContact:
  //   1. Opprett/oppdater kontakt (navn, epost, telefon, kommune)
  //   2. Sett tags fra lead.tags (rute til riktig forhandler-segment)
  //   3. Legg i liste "Husmatcher-leads"
  //   4. Trigge ev. varsling til forhandler (e-post via epost-skill / SureContact-automasjon)

  return beriket;
}
