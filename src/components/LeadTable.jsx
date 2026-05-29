// Redigerbar tabell for tilbudsutkastet.
// Håndverkeren fyller selv inn mengde, enhet og pris – ByggPilot gjetter ikke.
export default function LeadTable({ linjer, onEndre, onLeggTil, onFjern }) {
  function settFelt(idx, felt, verdi) {
    const ny = linjer.map((l, i) => (i === idx ? { ...l, [felt]: verdi } : l));
    onEndre(ny);
  }

  return (
    <div>
      {/* Desktop: ekte tabell */}
      <div className="hidden overflow-hidden rounded-xl border-2 border-gray-200 sm:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-antrasitt text-white">
              <th className="p-3 text-base font-bold">Beskrivelse</th>
              <th className="w-24 p-3 text-base font-bold">Mengde</th>
              <th className="w-24 p-3 text-base font-bold">Enhet</th>
              <th className="w-32 p-3 text-base font-bold">Pris (kr)</th>
              <th className="w-12 p-3 no-print" />
            </tr>
          </thead>
          <tbody>
            {linjer.map((l, idx) => (
              <tr key={idx} className="border-t border-gray-200 odd:bg-gray-50">
                <td className="p-2">
                  <input
                    value={l.beskrivelse}
                    onChange={(e) => settFelt(idx, "beskrivelse", e.target.value)}
                    placeholder="Arbeidslinje"
                    className="w-full rounded-lg border border-transparent bg-transparent p-2 text-lg text-antrasitt focus:border-bygg focus:bg-white focus:outline-none"
                  />
                </td>
                <td className="p-2">
                  <input
                    value={l.mengde}
                    onChange={(e) => settFelt(idx, "mengde", e.target.value)}
                    placeholder="—"
                    className="w-full rounded-lg border border-transparent bg-transparent p-2 text-lg text-antrasitt focus:border-bygg focus:bg-white focus:outline-none"
                  />
                </td>
                <td className="p-2">
                  <input
                    value={l.enhet}
                    onChange={(e) => settFelt(idx, "enhet", e.target.value)}
                    placeholder="—"
                    className="w-full rounded-lg border border-transparent bg-transparent p-2 text-lg text-antrasitt focus:border-bygg focus:bg-white focus:outline-none"
                  />
                </td>
                <td className="p-2">
                  <input
                    value={l.pris}
                    onChange={(e) => settFelt(idx, "pris", e.target.value)}
                    placeholder="—"
                    className="w-full rounded-lg border border-transparent bg-transparent p-2 text-lg font-semibold text-antrasitt focus:border-bygg focus:bg-white focus:outline-none"
                  />
                </td>
                <td className="p-2 text-center no-print">
                  <button
                    type="button"
                    onClick={() => onFjern(idx)}
                    className="grid h-8 w-8 place-items-center rounded-full text-gray-400 transition hover:bg-red-100 hover:text-kritisk"
                    aria-label="Fjern linje"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
            {linjer.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-lg text-gray-400">
                  Ingen linjer ennå – legg til arbeidslinjer under.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobil: kort pr. linje */}
      <div className="space-y-3 sm:hidden">
        {linjer.map((l, idx) => (
          <div key={idx} className="rounded-xl border-2 border-gray-200 p-3">
            <div className="flex items-start gap-2">
              <input
                value={l.beskrivelse}
                onChange={(e) => settFelt(idx, "beskrivelse", e.target.value)}
                placeholder="Arbeidslinje"
                className="flex-1 rounded-lg border border-gray-200 p-2 text-lg text-antrasitt focus:border-bygg focus:outline-none"
              />
              <button
                type="button"
                onClick={() => onFjern(idx)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-gray-400 hover:bg-red-100 hover:text-kritisk no-print"
                aria-label="Fjern linje"
              >
                ×
              </button>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <input value={l.mengde} onChange={(e) => settFelt(idx, "mengde", e.target.value)} placeholder="Mengde" className="rounded-lg border border-gray-200 p-2 text-base focus:border-bygg focus:outline-none" />
              <input value={l.enhet} onChange={(e) => settFelt(idx, "enhet", e.target.value)} placeholder="Enhet" className="rounded-lg border border-gray-200 p-2 text-base focus:border-bygg focus:outline-none" />
              <input value={l.pris} onChange={(e) => settFelt(idx, "pris", e.target.value)} placeholder="Pris" className="rounded-lg border border-gray-200 p-2 text-base font-semibold focus:border-bygg focus:outline-none" />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onLeggTil}
        className="mt-4 rounded-xl border-2 border-dashed border-gray-300 px-5 py-3 text-lg font-bold text-antrasitt transition hover:border-bygg hover:text-bygg-mork no-print"
      >
        + Legg til linje
      </button>
    </div>
  );
}
