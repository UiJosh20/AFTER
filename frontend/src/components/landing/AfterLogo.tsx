export function AfterLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* App Icon Mark */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto aspect-square"
      >
        <rect width="40" height="40" rx="12" fill="#0F0F11" />
        {/* Signature Violet Dot with Negative Space Arrow */}
        <circle cx="20" cy="20" r="10" fill="#7657ff" />
        <path
          d="M18 23L22 19M22 19H18.5M22 19V22.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Wordmark */}
      <span className="font-heading text-2xl font-bold tracking-tight text-[#171717]">
        after<span className="text-[#7657ff]">.</span>
      </span>
    </div>
  );
}