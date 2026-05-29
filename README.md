# Finn ditt drømmehus – LillesandHus husmatcher (MVP)

En mobil-først web-app der besøkende svarer på 5–6 enkle spørsmål og får sine
**3 beste matchende hustyper** rangert med match-score og en kort begrunnelse.
Deretter kan de sende inn kontaktinfo og bli rutet til riktig forhandler
(lead capture). Dette er et lead-gen-verktøy – kontaktsteget er det viktigste
konverteringspunktet.

> *For tradisjonen og fremtiden · Ditt hus – dine løsninger*

## Tech

- **React (Vite)** + **Tailwind CSS**, norsk UI (bokmål), mobil-først.
- Ingen backend i MVP. Matchingen er regelbasert og kjører helt client-side.
- Leads logges til konsollen via én `postLead()`-funksjon, ferdig forberedt for
  SureContact (se under).

## Kom i gang

```bash
npm install
npm run dev
```

Åpne URL-en Vite skriver ut (typisk `http://localhost:5173`).
Bygg for produksjon med `npm run build` og forhåndsvis med `npm run preview`.

## Prosjektstruktur

```
src/
  App.jsx                 # Layout: header med tagline, flyt, footer
  components/
    QuizFlow.jsx          # Styrer flyten: ett spørsmål om gangen, progress, tilbake
    Question.jsx          # Ett spørsmål med svarknapper
    Results.jsx           # Resultatskjerm: topp-3, lead-skjema, CTA
    HouseCard.jsx         # Ett rangert hus-kort (bilde + fakta + match-% + begrunnelse)
    LeadForm.jsx          # Kontaktskjema + validering + takke-tilstand
  lib/
    matcher.js            # HOUSES, QUESTIONS og all scoringslogikk
    leads.js              # postLead(), routeForhandler(), buildTags()
```

Husdataene, spørsmålene og scoringen ligger samlet i `src/lib/matcher.js`, og
all lead-/rutinglogikk i `src/lib/leads.js`, slik at det er lett å justere.

## Matching-algoritmen (kort)

For hvert hus akkumuleres poeng (maks 110), som normaliseres til 0–100 %:

| Kriterium      | Poeng |
| -------------- | ----- |
| Soverom        | eksakt +40, bom med 1 +20, bom med 2 +5 |
| Bad            | eksakt +20, bom med 1 +10 |
| Etasjer        | match +20 («Spiller ingen rolle» gir +20 til alle) |
| Størrelsesbånd | innenfor +20, ett bånd unna +8 |
| Husstand-nudge | +10 (par→færre sov / stor familie→flere sov) |

Topp 3 hus (høyest score) vises på resultatskjermen. Justér vekter eller data
direkte i `matcher.js`.

---

## 🔌 Integrasjon & videreutvikling

### (a) Koble `postLead()` til SureContact via backend-endpoint

`postLead(lead)` i `src/lib/leads.js` er den eneste inngangen for innsending. I
MVP beriker den leadet (forhandler + tags) og `console.log`-er det, så demoen
virker uten nøkler.

For å aktivere SureContact: opprett et **eget backend-/serverless-endpoint**
(f.eks. `/api/lead`) som holder API-nøkkelen hemmelig – aldri send nøkkelen fra
browseren. Avkommenter `fetch`-blokken i `postLead()`:

```js
await fetch("/api/lead", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(beriket),
});
```

Backend gjør så mot SureContact:

1. Opprett/oppdater kontakt (navn, epost, telefon, kommune)
2. Sett tags fra `lead.tags` (ruter til riktig forhandler-segment)
3. Legg kontakten i listen «Husmatcher-leads»
4. Trigg ev. varsling til forhandler (e-post / SureContact-automasjon)

Miljøvariabler er dokumentert i `.env.example` (`SURECONTACT_API_KEY`,
`LEAD_ENDPOINT`). Disse hører hjemme på backend, ikke client-side.

### (b) Oppdatere kommune → forhandler-mappingen

Rutingen styres av `FORHANDLER_MAP` øverst i `src/lib/leads.js` – et lett
redigerbart objekt med kommunenavn (små bokstaver) som nøkler:

```js
export const FORHANDLER_MAP = {
  lillesand: "LillesandHus Agder",
  oslo: "Viken-3 Bygg AS",
  // …
};
```

`routeForhandler(kommune)` normaliserer input og faller tilbake til
`DEFAULT_FORHANDLER` («LillesandHus Agder») ved ukjent kommune.

> ⚠️ Mappingen er et utgangspunkt – **bekreft full kommune→forhandler-mapping
> med LillesandHus** (markert med `TODO` i koden).

### (c) Oppgradere «begrunnelse»-teksten til Claude API senere

Begrunnelsen genereres i dag av `buildBegrunnelse()` i `matcher.js` ved å sette
sammen matchede kriterier til én setning. For mer naturlig språk kan dette
byttes ut med et Claude API-kall (via et backend-endpoint, ikke direkte fra
browseren). Send med husets data + brukerens svar, og be om en kort, varm
begrunnelse på bokmål. Resten av appen er uendret – kun teksten i `begrunnelse`
trenger en ny kilde.
