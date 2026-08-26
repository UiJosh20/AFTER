import { AnimatePresence, motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-5 py-4 shadow-sm">
      <motion.span
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: 0,
        }}
        className="h-2 w-2 rounded-full bg-neutral-400"
      />

      <motion.span
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: 0.15,
        }}
        className="h-2 w-2 rounded-full bg-neutral-400"
      />

      <motion.span
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: 0.3,
        }}
        className="h-2 w-2 rounded-full bg-neutral-400"
      />
    </div>
  );
}
