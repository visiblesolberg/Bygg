import QuizFlow from "./components/QuizFlow.jsx";

// App – layout: varm header med tagline, husmatcher-flyt, og enkel footer.
export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-krem">
      <header className="border-b border-salvie-lys bg-krem/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-6 text-center sm:py-8">
          <span className="text-xl font-semibold tracking-tight text-koks">
            LillesandHus
          </span>
          <span className="mt-1 text-sm italic text-salvie-mork">
            For tradisjonen og fremtiden
          </span>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 pt-8 text-center sm:pt-12">
          <h1 className="text-3xl font-semibold leading-tight text-koks sm:text-4xl">
            Finn ditt drømmehus
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-koks/70">
            Svar på noen få enkle spørsmål, så finner vi hustypene fra
            LillesandHus som passer deg og familien din best.
          </p>
        </section>

        <QuizFlow />
      </main>

      <footer className="border-t border-salvie-lys py-6 text-center text-sm text-koks/50">
        © {new Date().getFullYear()} LillesandHus · Ditt hus – dine løsninger
      </footer>
    </div>
  );
}
