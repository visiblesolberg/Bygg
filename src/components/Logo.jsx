// ByggPilot-merke: liten "varsel/bygg"-trekant + ordmerke.
export default function Logo({ size = "md" }) {
  const dim = size === "lg" ? 44 : 34;
  return (
    <div className="flex items-center gap-3">
      <div
        className="grid place-items-center rounded-xl bg-bygg shadow-aksent"
        style={{ width: dim, height: dim }}
        aria-hidden="true"
      >
        <svg
          width={dim * 0.6}
          height={dim * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1B1E24"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3 L22 20 H2 Z" fill="#1B1E24" stroke="none" opacity="0.18" />
          <path d="M12 3 L22 20 H2 Z" />
          <path d="M12 10 v5" />
          <circle cx="12" cy="18" r="0.4" fill="#1B1E24" />
        </svg>
      </div>
      <div className="leading-none">
        <span
          className={
            (size === "lg" ? "text-3xl " : "text-2xl ") +
            "font-extrabold tracking-tight text-white"
          }
        >
          ByggPilot <span className="text-bygg">AI</span>
        </span>
      </div>
    </div>
  );
}
