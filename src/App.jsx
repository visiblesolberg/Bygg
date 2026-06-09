import QuizFlow from "./components/QuizFlow.jsx";

// App – layout: varm header, hero med bakgrunnsbilde, husmatcher-flyt og footer.
export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-krem">
      {/* Hero – fullbredde bakgrunnsbilde med myk gradient-fallback + overlay.
          Legg ditt eget bilde i public/hero.jpg (se public/README.md). */}
      <header className="relative isolate overflow-hidden">
        {/* Fallback-gradient (vises hvis hero.jpg mangler) */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#cfe0ea] via-salvie-lys to-krem" />
        {/* Bakgrunnsbilde */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}hero.jpg)` }}
        />
        {/* Lesbarhets-overlay som tones ned mot krem-bakgrunnen */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/40 via-krem/30 to-krem" />

        <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 text-center sm:pb-24 sm:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-salvie-mork">
            LillesandHus
          </p>
          <p className="mt-1 text-sm italic text-salvie-mork/90">
            For tradisjonen og fremtiden
          </p>

          <h1 className="mt-8 text-4xl font-semibold leading-tight text-koks drop-shadow-sm sm:text-5xl">
            Finn ditt drømmehus
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-koks/80">
            Svar på noen få enkle spørsmål, så finner vi hustypene fra
            LillesandHus som passer deg og familien din best.
          </p>

          <a
            href="#start"
            className="mt-8 inline-flex items-center rounded-full bg-salvie px-7 py-3 text-base font-semibold text-white shadow-kort transition-all hover:bg-salvie-mork active:scale-[0.99]"
          >
            Kom i gang ↓
          </a>
        </div>
      </header>

      <main id="start" className="flex-1 scroll-mt-4">
        <QuizFlow />
      </main>

      <footer className="border-t border-salvie-lys py-6 text-center text-sm text-koks/50">
        © {new Date().getFullYear()} LillesandHus · Ditt hus – dine løsninger
      </footer>
    </div>
  );
}
