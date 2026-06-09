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
        {/* Bakgrunnsbilde – vises i full styrke */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}hero.jpg)` }}
        />
        {/* Kun en myk overgang nederst, så hero smelter inn i krem-bakgrunnen */}
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-krem" />

        <div className="mx-auto max-w-3xl px-4 pb-20 pt-16 text-center sm:pb-28 sm:pt-20">
          {/* Varm, frostet panel bak teksten for god lesbarhet mot lyst bilde */}
          <div className="mx-auto max-w-2xl rounded-[2rem] bg-krem/70 px-6 py-10 shadow-kort backdrop-blur-md sm:px-12 sm:py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-salvie-mork">
              LillesandHus
            </p>
            <p className="mt-1 text-base italic text-salvie-mork">
              For tradisjonen og fremtiden
            </p>

            <h1 className="mt-6 text-5xl font-bold leading-[1.05] text-koks sm:text-6xl">
              Finn ditt drømmehus
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-xl leading-relaxed text-koks/85 sm:text-2xl">
              Svar på noen få enkle spørsmål, så finner vi hustypene fra
              LillesandHus som passer deg og familien din best.
            </p>

            <a
              href="#start"
              className="mt-8 inline-flex items-center rounded-full bg-salvie px-8 py-4 text-lg font-semibold text-white shadow-kort transition-all hover:bg-salvie-mork active:scale-[0.99]"
            >
              Kom i gang ↓
            </a>
          </div>
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
