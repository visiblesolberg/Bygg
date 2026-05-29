import { useState } from "react";
import IntakeScreen from "./components/IntakeScreen.jsx";
import LoadingState from "./components/LoadingState.jsx";
import ResultView from "./components/ResultView.jsx";
import { analyserHenvendelse } from "./lib/analyze.js";

// Flytens tre tilstander: inntak -> laster -> resultat.
export default function App() {
  const [steg, setSteg] = useState("inntak"); // "inntak" | "laster" | "resultat"
  const [resultat, setResultat] = useState(null);
  const [feil, setFeil] = useState("");

  async function håndterAnalyse(input) {
    setFeil("");
    setSteg("laster");
    try {
      const data = await analyserHenvendelse(input);
      setResultat(data);
      setSteg("resultat");
    } catch (e) {
      // Aldri hvit skjerm: tilbake til inntak med vennlig norsk feilmelding.
      setFeil(
        (e && e.message) || "Noe gikk galt under analysen. Prøv igjen om litt."
      );
      setSteg("inntak");
    }
  }

  function nyAnalyse() {
    setResultat(null);
    setFeil("");
    setSteg("inntak");
  }

  if (steg === "laster") return <LoadingState />;

  if (steg === "resultat" && resultat) {
    return <ResultView resultat={resultat} onNyAnalyse={nyAnalyse} />;
  }

  return <IntakeScreen onAnalyser={håndterAnalyse} startfeil={feil} />;
}
