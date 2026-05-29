// Enkel, robust PDF-eksport: bruker nettleserens utskrift (Lagre som PDF).
// Print-vennlig CSS i index.css (@media print) skjuler knapper og rydder layout,
// slik at resultatet blir et rent, profesjonelt ByggPilot-grunnlag.
export default function PdfExport({ className = "" }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        "rounded-xl bg-bygg px-5 py-3 text-lg font-extrabold text-antrasitt shadow-aksent transition hover:bg-bygg-mork hover:text-white " +
        className
      }
    >
      Eksporter som PDF
    </button>
  );
}
