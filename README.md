# ByggPilot AI (MVP)

> **Fra rotete henvendelse til tilbuds-klart utkast — på sekunder.**

Et internt verktøy for norske byggefirmaer og håndverkere. Du limer inn en rotete
kundehenvendelse (melding + bilder + ev. PDF), og får på sekunder tilbake et
strukturert **prosjektgrunnlag**: sammendrag, arbeidsomfang, en sjekkliste over
**det du må avklare før tilbud**, flagg for norske byggekrav, og et **tilbuds-klart
utkast** du selv fyller inn pris og tid på.

ByggPilot lager **ikke** et ferdig prissatt tilbud. Det rydder kaos til et utkast og
en sjekkliste — du beholder kontrollen over pris og tid. Analysen gjøres av
**Claude (Anthropic)**, multimodalt (tekst + bilder + PDF).

---

## (a) Kjøreinstruksjoner

```bash
# 1. Installer avhengigheter
npm install

# 2. Legg inn API-nøkkel
cp .env.example .env
#   …og sett VITE_ANTHROPIC_API_KEY=sk-ant-... i .env

# 3. Start dev-server
npm run dev
```

Åpne URL-en Vite skriver ut (typisk `http://localhost:5173`).
Bygg for produksjon med `npm run build`, forhåndsvis med `npm run preview`.

> **Tips for demo:** Trenger du ikke skrive noe? Klikk **«Prøv et eksempel»** på
> inntaksskjermen for å fylle inn en ferdig kjøkken-case, og last gjerne opp et
> hvilket som helst kjøkkenbilde. Hele flyten tar under 60 sekunder.

### Om API-nøkkelen

MVP-en kaller Anthropic-API-et **direkte fra nettleseren** (med headeren
`anthropic-dangerous-direct-browser-access`). Nøkkelen leses fra `.env`
(`VITE_ANTHROPIC_API_KEY`) og ligger dermed ikke i koden — men den blir en del av
frontend-bundelen. Det er greit for en **lokal demo**, men ikke for produksjon
(se «Neste steg»). `.env` er git-ignorert.

---

## (b) Hvor man bytter modell / justerer system-prompten

Alt som styrer AI-en ligger i **`src/lib/analyze.js`**:

| Hva | Hvor |
| --- | --- |
| **Modell** | Konstanten `MODELL` øverst (standard: `claude-sonnet-4-20250514`). |
| **Systeminstruks** (hva ByggPilot kan/ikke kan, norske krav, regler) | Konstanten `SYSTEM_PROMPT`. |
| **Output-skjema** | Beskrevet i `SYSTEM_PROMPT`; trygt parset av `parseClaudeJson()` og fylt ut av `normaliserResultat()`. |

Brønnøysund-oppslaget (orgnr → firmainfo) ligger separat i **`src/lib/brreg.js`**.

---

## Prosjektstruktur

```
src/
  App.jsx                    # Flyt: inntak -> laster -> resultat (+ feilhåndtering)
  components/
    IntakeScreen.jsx         # Skjerm 1: tekst, opplasting, orgnr/Brreg, "Prøv et eksempel"
    LoadingState.jsx         # Lasteanimasjon ("Leser henvendelsen…" osv.)
    ResultView.jsx           # Skjerm 2: alle resultatkort + topp-handlinger
    LeadTable.jsx            # Redigerbar tilbudstabell (beskrivelse/mengde/enhet/pris)
    PdfExport.jsx            # "Eksporter som PDF" (print-basert)
    Logo.jsx                 # ByggPilot-merke
  lib/
    analyze.js               # Claude-kallet + JSON-parsing (kjernen)
    brreg.js                 # Brønnøysund-oppslag (din moat)
    example.js               # Ferdig demo-case
```

### Output-skjema (Claude returnerer nøyaktig dette)

```json
{
  "prosjekttype": "nybygg | tilbygg | rehabilitering | reparasjon | befaring | ukjent",
  "sammendrag": "2-4 setningers prosjektsammendrag på norsk",
  "kunde": { "navn": "", "type": "privat | bedrift | ukjent", "adresse": "", "kontakt": "" },
  "scope": ["punktvis det som er sagt/synlig"],
  "mangler": ["info håndverkeren MÅ innhente før tilbud"],
  "norske_flagg": [
    { "type": "søknadsplikt | asbest | våtrom | trenger_elektriker | trenger_rørlegger | ansvarsrett | annet",
      "tekst": "kort forklaring", "alvorlighet": "info | viktig | kritisk" }
  ],
  "tilbudsutkast": {
    "tittel": "",
    "linjer": [ { "beskrivelse": "", "mengde": "", "enhet": "", "pris": "" } ],
    "forbehold": ["standard norske forbehold"]
  }
}
```

Alle pris- og mengdefelt er **bevisst tomme** — håndverkeren fyller dem inn selv.

---

## (c) Neste steg (ikke bygget i MVP)

Dette er en demo. For å gjøre ByggPilot til et produkt:

- **Hemmelig API-nøkkel via backend.** Flytt Claude-kallet til et eget
  backend-/serverless-endepunkt (f.eks. `/api/analyser`) slik at API-nøkkelen aldri
  eksponeres i nettleseren. Frontend poster bare henvendelsen dit.
- **Lagre saker.** Persistér hver analyse (database) slik at håndverkeren kan komme
  tilbake til en sak, se historikk og oppdatere utkastet over tid.
- **Send utkast videre.** Eksporter/overfør det ferdige utkastet til e-post eller et
  fakturerings-/tilbudssystem som **Conta**, slik at veien fra utkast til sendt tilbud
  blir sømløs.
- **Flerbruker.** Innlogging, firmaprofil, roller og delte saker — slik at hele firmaet
  jobber i samme verktøy.
- **Rikere Brreg-moat.** Utvid firmaoppslaget (roller, regnskapstall, kredittsignaler)
  som ekstra beslutningsstøtte.

> **Framing:** ByggPilot selger **tidsbesparelsen** og **«hva du må huske å spørre om»** —
> ikke magi. Håndverkeren beholder alltid kontrollen over pris og tid.
