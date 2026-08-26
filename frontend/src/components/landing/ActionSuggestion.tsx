import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function ActionSuggestion({ text }: { text: string }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      className="flex w-full items-center justify-between rounded-xl border border-black/[0.07] bg-[#fafafa] px-4 py-3 text-left text-sm transition hover:border-[#7657ff]/30 hover:bg-white"
    >
      <span>{text}</span>

      <ArrowRight
        size={15}
        className="shrink-0 text-neutral-400"
      />
    </motion.button>
  );
}