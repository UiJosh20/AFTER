export function FinancialStat({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white/70 p-3">
      <p className="text-xs text-neutral-400">{label}</p>

      <p
        className={`mt-1 font-semibold ${
          danger ? "text-red-600" : "text-neutral-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}