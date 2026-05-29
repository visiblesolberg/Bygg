// =============================================================================
// matcher.js – husdata + regelbasert, client-side matching for LillesandHus.
//
// Alt som er lett å justere bor her: selve husdataene (HOUSES), spørsmålene
// (QUESTIONS), poengvektene (MAX_SCORE) og scoringslogikken. Ingen eksterne
// API-kall – matchingen kjører helt i nettleseren.
// =============================================================================

// --- Husdata (url-ene er ekte LillesandHus-hustyper) ------------------------
export const HOUSES = [
  { navn: "Mandal", m2: 116.1, sov: 4, bad: 2, etg: 2, url: "https://lillesandhus.no/hustyper/mandal/" },
  { navn: "Oksø", m2: 115.2, sov: 4, bad: 1, etg: 1, url: "https://lillesandhus.no/hustyper/okso/" },
  { navn: "Kristiansand", m2: 124.3, sov: 3, bad: 1, etg: 1, url: "https://lillesandhus.no/hustyper/kristiansand/" },
  { navn: "Hankø", m2: 129.9, sov: 4, bad: 2, etg: 2, url: "https://lillesandhus.no/hustyper/hanko/" },
  { navn: "Søgne", m2: 130.3, sov: 4, bad: 2, etg: 2, url: "https://lillesandhus.no/hustyper/sogne/" },
  { navn: "Homborsund", m2: 137.6, sov: 3, bad: 2, etg: 2, url: "https://lillesandhus.no/hustyper/homborsund/" },
  { navn: "Lillesand", m2: 140.2, sov: 3, bad: 2, etg: 2, url: "https://lillesandhus.no/hustyper/lillesand/" },
  { navn: "Matros", m2: 147.2, sov: 3, bad: 2, etg: 2, url: "https://lillesandhus.no/hustyper/matros/" },
  { navn: "Kragerø", m2: 156, sov: 5, bad: 3, etg: 2, url: "https://lillesandhus.no/hustyper/kragero/" },
  { navn: "Holmsbu", m2: 157.3, sov: 3, bad: 2, etg: 2, url: "https://lillesandhus.no/hustyper/holmsbu/" },
  { navn: "Hellesund", m2: 161.3, sov: 3, bad: 2, etg: 2, url: "https://lillesandhus.no/hustyper/hellesund/" },
  { navn: "Høvåg", m2: 168.4, sov: 4, bad: 2, etg: 2, url: "https://lillesandhus.no/hustyper/hovag/" },
  { navn: "Tvedestrand", m2: 169.5, sov: 4, bad: 2, etg: 2, url: "https://lillesandhus.no/hustyper/tvedestrand/" },
  { navn: "Kilsund", m2: 172.5, sov: 4, bad: 2, etg: 2, url: "https://lillesandhus.no/hustyper/kilsund/" },
  { navn: "Brekkestø", m2: 176.9, sov: 3, bad: 2, etg: 2, url: "https://lillesandhus.no/hustyper/brekkesto/" },
  { navn: "Arnestad", m2: 199.4, sov: 4, bad: 2, etg: 2, url: "https://lillesandhus.no/hustyper/arnestad/" },
  { navn: "Hudøy", m2: 240, sov: 6, bad: 2, etg: 2, url: "https://lillesandhus.no/hustyper/hudoy/" },
  { navn: "Tønsberg", m2: 260.9, sov: 3, bad: 4, etg: 2, url: "https://lillesandhus.no/hustyper/tonsberg/" },
  { navn: "Sandefjord", m2: 270.8, sov: 4, bad: 3, etg: 2, url: "https://lillesandhus.no/hustyper/sandefjord/" },
  { navn: "Bygdøy", m2: 375.8, sov: 4, bad: 4, etg: 3, url: "https://lillesandhus.no/hustyper/bygdoy-2/" },
  { navn: "Herregård", m2: 377.4, sov: 4, bad: 2, etg: 2, url: "https://lillesandhus.no/hustyper/herregard/" },
];

// --- Maks oppnåelig score (40 sov + 20 bad + 20 etg + 20 størrelse + 10 nudge)
export const MAX_SCORE = 110;

// --- Spørsmålene (én skjerm per spørsmål) -----------------------------------
// `key` brukes som nøkkel i svar-objektet. `scored: false` på tomt-spørsmålet
// markerer at det kun er en lead-kvalifiserer og ikke påvirker scoring.
export const QUESTIONS = [
  {
    key: "husstand",
    sporsmal: "Hvem skal bo i huset?",
    valg: [
      { value: "par", label: "Par uten barn" },
      { value: "liten-familie", label: "Liten familie (1–2 barn)" },
      { value: "stor-familie", label: "Stor familie (3+ barn)" },
      { value: "flergenerasjon", label: "Flergenerasjon" },
    ],
  },
  {
    key: "soverom",
    sporsmal: "Hvor mange soverom trenger du?",
    valg: [
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5+", label: "5+" },
    ],
  },
  {
    key: "bad",
    sporsmal: "Hvor mange bad/wc ønsker du?",
    valg: [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3+", label: "3+" },
    ],
  },
  {
    key: "etasjer",
    sporsmal: "Hvor mange etasjer foretrekker du?",
    valg: [
      { value: "1", label: "1 etasje" },
      { value: "2", label: "2 etasjer" },
      { value: "uansett", label: "Spiller ingen rolle" },
    ],
  },
  {
    key: "storrelse",
    sporsmal: "Hvor stort hus ser du for deg?",
    valg: [
      { value: "kompakt", label: "Kompakt (under 140 m²)" },
      { value: "mellom", label: "Mellomstort (140–200 m²)" },
      { value: "romslig", label: "Romslig (200 m²+)" },
    ],
  },
  {
    key: "tomt",
    sporsmal: "Har du allerede tomt?",
    // Påvirker ikke scoring – kun lead-kvalifiserer (se postLead i leads.js).
    scored: false,
    valg: [
      { value: "ja", label: "Ja" },
      { value: "trenger-hjelp", label: "Nei, trenger hjelp til å finne tomt" },
    ],
  },
];

// --- Hjelpere ---------------------------------------------------------------

// Hvilket størrelsesbånd ligger et hus i? 0 = kompakt, 1 = mellom, 2 = romslig.
function bandForM2(m2) {
  if (m2 < 140) return 0;
  if (m2 <= 200) return 1;
  return 2;
}

const BAND_INDEX = { kompakt: 0, mellom: 1, romslig: 2 };

// Antall soverom et "5+"-svar tilsvarer i beregningen.
function soveromBehov(svar) {
  return svar === "5+" ? 5 : Number(svar);
}

// Antall bad et "3+"-svar tilsvarer i beregningen.
function badBehov(svar) {
  return svar === "3+" ? 3 : Number(svar);
}

// =============================================================================
// scoreHouse(hus, svar)
// Returnerer { score, prosent, grunner } for ett hus gitt brukerens svar.
// `grunner` er en liste over hvilke kriterier som traff – brukes til å bygge
// en lesbar begrunnelse på resultatskjermen.
// =============================================================================
export function scoreHouse(hus, svar) {
  let score = 0;
  const grunner = [];

  // --- Soverom ---
  const sovBehov = soveromBehov(svar.soverom);
  if (svar.soverom === "5+") {
    if (hus.sov >= 5) {
      score += 40;
      grunner.push(`${hus.sov} soverom`);
    } else if (5 - hus.sov === 1) {
      score += 20;
    } else if (5 - hus.sov === 2) {
      score += 5;
    }
  } else {
    const diff = Math.abs(hus.sov - sovBehov);
    if (diff === 0) {
      score += 40;
      grunner.push(`${hus.sov} soverom`);
    } else if (diff === 1) {
      score += 20;
    } else if (diff === 2) {
      score += 5;
    }
  }

  // --- Bad ---
  const badN = badBehov(svar.bad);
  const badEksakt = svar.bad === "3+" ? hus.bad >= 3 : hus.bad === badN;
  if (badEksakt) {
    score += 20;
    grunner.push(`${hus.bad} bad`);
  } else if (Math.abs(hus.bad - badN) === 1) {
    score += 10;
  }

  // --- Etasjer ---
  if (svar.etasjer === "uansett") {
    score += 20;
  } else if (hus.etg === Number(svar.etasjer)) {
    score += 20;
    grunner.push(`${hus.etg} ${hus.etg === 1 ? "etasje" : "etasjer"}`);
  }

  // --- Størrelsesbånd ---
  const husBand = bandForM2(hus.m2);
  const valgtBand = BAND_INDEX[svar.storrelse];
  const bandDiff = Math.abs(husBand - valgtBand);
  if (bandDiff === 0) {
    score += 20;
    grunner.push(STORRELSE_GRUNN[svar.storrelse]);
  } else if (bandDiff === 1) {
    score += 8;
  }

  // --- Husstand → soverom-nudge ---
  if (svar.husstand === "par" && hus.sov <= 3) {
    score += 10;
  } else if (
    (svar.husstand === "stor-familie" || svar.husstand === "flergenerasjon") &&
    hus.sov >= 4
  ) {
    score += 10;
    grunner.push("god plass til en stor husstand");
  }

  const prosent = Math.round((score / MAX_SCORE) * 100);
  return { score, prosent, grunner };
}

// Tekstbiter til begrunnelsen, knyttet til størrelsesbånd.
const STORRELSE_GRUNN = {
  kompakt: "kompakt og praktisk størrelse",
  mellom: "romslig mellomstor størrelse",
  romslig: "ekstra god plass",
};

// =============================================================================
// matchHouses(svar) → topp 3 hus, rangert synkende på score.
// Hvert element: { ...hus, score, prosent, begrunnelse }.
// =============================================================================
export function matchHouses(svar) {
  return HOUSES.map((hus) => {
    const { score, prosent, grunner } = scoreHouse(hus, svar);
    return { ...hus, score, prosent, begrunnelse: buildBegrunnelse(grunner) };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// =============================================================================
// buildBegrunnelse(grunner) → én lesbar norsk setning fra matchede kriterier.
// (Kan senere byttes ut med et Claude API-kall for mer naturlig språk – se README.)
// =============================================================================
export function buildBegrunnelse(grunner) {
  if (!grunner.length) {
    return "Et solid alternativ som er verdt en nærmere titt.";
  }
  let liste;
  if (grunner.length === 1) {
    liste = grunner[0];
  } else {
    liste = grunner.slice(0, -1).join(", ") + " og " + grunner[grunner.length - 1];
  }
  return `Passer godt fordi den har ${liste}.`;
}
