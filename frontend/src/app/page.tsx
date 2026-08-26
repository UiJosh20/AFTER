"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const sections = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Why AFTER", href: "#why-after" },
  { label: "Example", href: "#example" },
];

export default function Home() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8f7f3] text-[#171717]">
      {/* ================= NAVIGATION ================= */}

      <nav className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-black/[0.08] bg-white/80 px-5 py-3 shadow-sm backdrop-blur-xl">
          <button
            onClick={() => scrollTo("#hero")}
            className="font-heading text-2xl tracking-tight"
          >
            after<span className="text-[#7657ff]">.</span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {sections.map((section) => (
              <button
                key={section.href}
                onClick={() => scrollTo(section.href)}
                className="text-sm text-neutral-600 transition hover:text-black"
              >
                {section.label}
              </button>
            ))}
          </div>

          <a
            href="https://github.com/UiJosh20/AFTER"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 30 30"
              fill="currentColor"
            >
              <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
            </svg>
            <span className="hidden sm:block">Star on GitHub</span>
            <span className="sm:hidden">GitHub</span>
          </a>
        </div>
      </nav>

      {/* ================= HERO ================= */}

  <section
  id="hero"
  className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f7f3] py-20 lg:py-0"
>
  {/* Background Glows & Grid */}
  {/* <div className="pointer-events-none absolute inset-0">
    <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-[#7657ff]/[0.06] blur-[120px]" />
    <div className="absolute top-1/2 left-[-100px] h-[500px] w-[500px] rounded-full bg-amber-500/[0.03] blur-[100px]" />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
  </div> */}

  {/* Responsive Flex Wrapper */}
  <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-12 px-6 pt-28 sm:px-10 lg:flex-row lg:gap-16 lg:px-12 lg:pt-0">
    
    {/* Hero Text Column */}
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      className="w-full flex-1 max-w-2xl text-left"
    >
    

      <h1 className="font-heading text-5xl leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-7xl xl:text-8xl">
        Make better
        <br />
        money <span className="italic text-[#7657ff]">decisions.</span>
      </h1>

      <p className="mt-6 max-w-lg text-base leading-7 text-neutral-600 sm:text-lg lg:text-xl">
        Talk to AFTER about anything financial. Get clarity on what your
        decision means before you make it.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          onClick={() => scrollTo("#example")}
          className="group flex items-center justify-center gap-3 rounded-full bg-black px-7 py-4 font-medium text-white shadow-lg shadow-black/5 transition hover:-translate-y-0.5 hover:bg-neutral-800"
        >
          See how AFTER works
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>

        <a
          href="https://github.com/UiJosh20/AFTER"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-7 py-4 font-medium text-neutral-800 transition hover:border-black/20 hover:bg-neutral-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 30 30"
            fill="currentColor"
          >
            <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
          </svg>
          View source
        </a>
      </div>
    </motion.div>

    {/* Live Simulator Column */}
    <div className="w-full flex-1 max-w-xl lg:max-w-none">
      {/* <Reveal delay={0.15}>
        <div className="overflow-hidden rounded-[2rem] border border-black/[0.08] bg-[#fafafa] shadow-2xl shadow-black/[0.07]">
          <div className="flex items-center justify-between border-b border-black/[0.07] bg-white px-5 py-4 sm:px-7">
            <div>
              <p className="font-semibold">after.</p>
              <p className="text-xs text-neutral-400">
                Your financial decision companion
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-green-600">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Online
            </div>
          </div>

          <div className="max-h-[460px] min-h-[400px] space-y-4 overflow-y-auto bg-[#f8f7f3] p-4 sm:p-6">
            <ChatMessage
              side="right"
              delay={0.3}
              className="bg-[#7657ff] text-white"
            >
              I make ₦1.2m a month, spend around ₦700k and have ₦4m saved. I
              found an ₦8m car I really like. Should I buy it?
            </ChatMessage>

            <ChatMessage
              side="left"
              delay={1.2}
              className="bg-white text-neutral-800"
            >
              <div>
                <p className="leading-6 text-sm sm:text-base">
                  I understand why you want it. But based on what you've
                  told me, I wouldn't recommend buying the ₦8m car right
                  now.
                </p>

                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-500">
                    Financial risk
                  </p>
                  <p className="mt-0.5 text-lg font-semibold text-red-700">
                    Critical
                  </p>

                  <div className="mt-2 space-y-1 text-xs text-red-700/80">
                    <p>• Your savings: ₦4,000,000</p>
                    <p>• Purchase: ₦8,000,000</p>
                    <p>• Remaining savings: -₦4,000,000</p>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <Suggestion text="Find a cheaper car" />
                  <Suggestion text="Calculate a safe car budget" />
                  <Suggestion text="Build a car savings plan" />
                </div>
              </div>
            </ChatMessage>

            <ChatMessage
              side="right"
              delay={2.1}
              className="bg-[#7657ff] text-white"
            >
              Okay. What price range would actually make sense for me?
            </ChatMessage>

            <ChatMessage
              side="left"
              delay={2.9}
              className="bg-white text-neutral-800"
            >
              Based on your current numbers, I'd rather help you work out a
              purchase price that leaves you with a healthy emergency
              buffer. Let's calculate it together.
            </ChatMessage>
          </div>

          <div className="border-t border-black/[0.07] bg-white p-4">
            <div className="flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 py-3">
              <span className="flex-1 text-xs text-neutral-400 sm:text-sm">
                Ask AFTER anything about your money...
              </span>

              <div className="rounded-xl bg-black p-2 text-white">
                <Send size={15} />
              </div>
            </div>
          </div>
        </div>
      </Reveal> */}
        <Reveal delay={0.15}>
            <LiveChatSimulation />
          </Reveal>
    </div>
  </div>
</section>
      {/* ================= HOW IT WORKS ================= */}

      <section
        id="how-it-works"
        className="scroll-mt-24 bg-white px-6 py-28 sm:py-36"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7657ff]">
                How it works
              </p>

              <h2 className="mx-auto mt-5 max-w-3xl font-heading text-5xl leading-tight sm:text-6xl">
                Just talk to AFTER.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-600">
                No forms. No financial jargon. Say what you're thinking, exactly
                how you'd say it to another person.
              </p>
            </div>
          </Reveal>
   {/* <Reveal delay={0.15}>
            <LiveChatSimulation />
          </Reveal> */}
          <Reveal delay={0.15}>
        <div className="overflow-hidden rounded-[2rem] border border-black/[0.08] bg-[#fafafa] shadow-2xl shadow-black/[0.07]">
          <div className="flex items-center justify-between border-b border-black/[0.07] bg-white px-5 py-4 sm:px-7">
            <div>
              <p className="font-semibold">after.</p>
              <p className="text-xs text-neutral-400">
                Your financial decision companion
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-green-600">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Online
            </div>
          </div>

          <div className="max-h-[460px] min-h-[400px] space-y-4 overflow-y-auto bg-[#f8f7f3] p-4 sm:p-6">
            <ChatMessage
              side="right"
              delay={0.3}
              className="bg-[#7657ff] text-white"
            >
              I make ₦1.2m a month, spend around ₦700k and have ₦4m saved. I
              found an ₦8m car I really like. Should I buy it?
            </ChatMessage>

            <ChatMessage
              side="left"
              delay={1.2}
              className="bg-white text-neutral-800"
            >
              <div>
                <p className="leading-6 text-sm sm:text-base">
                  I understand why you want it. But based on what you've
                  told me, I wouldn't recommend buying the ₦8m car right
                  now.
                </p>

                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-500">
                    Financial risk
                  </p>
                  <p className="mt-0.5 text-lg font-semibold text-red-700">
                    Critical
                  </p>

                  <div className="mt-2 space-y-1 text-xs text-red-700/80">
                    <p>• Your savings: ₦4,000,000</p>
                    <p>• Purchase: ₦8,000,000</p>
                    <p>• Remaining savings: -₦4,000,000</p>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <Suggestion text="Find a cheaper car" />
                  <Suggestion text="Calculate a safe car budget" />
                  <Suggestion text="Build a car savings plan" />
                </div>
              </div>
            </ChatMessage>

            <ChatMessage
              side="right"
              delay={2.1}
              className="bg-[#7657ff] text-white"
            >
              Okay. What price range would actually make sense for me?
            </ChatMessage>

            <ChatMessage
              side="left"
              delay={2.9}
              className="bg-white text-neutral-800"
            >
              Based on your current numbers, I'd rather help you work out a
              purchase price that leaves you with a healthy emergency
              buffer. Let's calculate it together.
            </ChatMessage>
          </div>

          <div className="border-t border-black/[0.07] bg-white p-4">
            <div className="flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 py-3">
              <span className="flex-1 text-xs text-neutral-400 sm:text-sm">
                Ask AFTER anything about your money...
              </span>

              <div className="rounded-xl bg-black p-2 text-white">
                <Send size={15} />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
         
        </div>
      </section>

      {/* ================= WHY AFTER ================= */}

      <section
        id="why-after"
        className="scroll-mt-24 bg-[#f8f7f3] px-6 py-28 sm:py-36"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7657ff]">
                Why AFTER
              </p>

              <h2 className="mt-5 font-heading text-5xl leading-tight sm:text-6xl">
                Money decisions are rarely just numbers.
              </h2>

              <p className="mt-6 text-lg leading-8 text-neutral-600">
                Sometimes you want the thing. Sometimes you need the thing.
                Sometimes you just need someone to help you think clearly before
                you spend the money.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            <InfoCard
              title="Speak naturally"
              text="Say exactly what you're thinking. AFTER doesn't require you to speak like a financial analyst."
            />

            <InfoCard
              title="See the consequence"
              text="AFTER translates your situation into understandable numbers, risk and financial impact."
            />

            <InfoCard
              title="Do something about it"
              text="Instead of stopping at an answer, AFTER can suggest safer alternatives and next steps."
            />
          </div>
        </div>
      </section>

      {/* ================= EXAMPLE ================= */}

      <section
        id="example"
        className="scroll-mt-24 bg-black px-6 py-28 text-white sm:py-36"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#aaa0ff]">
              The idea
            </p>

            <h2 className="mt-5 max-w-4xl font-heading text-5xl leading-tight sm:text-7xl">
              Before you make the decision.
              <br />
              <span className="text-[#aaa0ff]">Ask AFTER.</span>
            </h2>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/60">
              A financial companion built around one simple question:
              <span className="text-white">
                {" "}
                "What happens if I actually do this?"
              </span>
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-14 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => (window.location.href = "/app")}
                className="group flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 font-medium text-black transition hover:bg-neutral-200"
              >
                Talk to AFTER
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <a
                href="https://github.com/UiJosh20/AFTER"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-4 font-medium text-white transition hover:bg-white/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 30 30"
                  fill="currentColor"
                >
                  <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                </svg>
                Explore the project
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-black/[0.07] bg-white px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-neutral-500 sm:flex-row">
          <p className="font-heading text-xl text-black">
            after<span className="text-[#7657ff]">.</span>
          </p>

          <p>Built for people making real financial decisions.</p>

          <a
            href="https://github.com/UiJosh20/AFTER"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition hover:text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 30 30"
              fill="currentColor"
            >
              <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
            </svg>
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}

/* ========================================================= */
/* COMPONENTS */
/* ========================================================= */

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-5 py-4 shadow-sm">
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

function ActionSuggestion({ text }: { text: string }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      className="flex w-full items-center justify-between rounded-xl border border-black/[0.07] bg-[#fafafa] px-4 py-3 text-left text-sm transition hover:border-[#7657ff]/30 hover:bg-white"
    >
      <span>{text}</span>
      <ArrowRight size={15} className="shrink-0 text-neutral-400" />
    </motion.button>
  );
}

function ChatMessage({
  children,
  side,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  side: "left" | "right";
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.55,
        delay,
      }}
      className={`flex ${side === "right" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-2xl rounded-2xl px-5 py-4 text-sm leading-6 shadow-sm sm:text-base ${className}`}
      >
        {children}
      </div>
    </motion.div>
  );
}

function Suggestion({ text }: { text: string }) {
  return (
    <button className="flex w-full items-center justify-between rounded-xl border border-black/[0.07] bg-white px-4 py-3 text-left text-sm transition hover:border-[#7657ff]/30 hover:bg-[#faf9ff]">
      <span>{text}</span>
      <ArrowRight size={15} className="text-neutral-400" />
    </button>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <Reveal>
      <div className="rounded-[2rem] border border-black/[0.07] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.05]">
        <p className="text-lg font-semibold">{title}</p>
        <p className="mt-4 leading-7 text-neutral-600">{text}</p>
      </div>
    </Reveal>
  );
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ================= LIVE CHAT SIMULATION ================= */

function LiveChatSimulation() {
  const [step, setStep] = useState(0);
  const [inputText, setInputText] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const firstUserMsg =
    "I make ₦1.2m monthly, spend ₦700k, and have ₦4m saved. I found an ₦8m car. Should I buy it?";
  const secondUserMsg =
    "What price range would actually make financial sense for me right now?";

  // Scroll chat down smoothly as new messages pop in
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [step, inputText]);

  // Handle auto-advancing simulation steps with hover pause support
  useEffect(() => {
    if (isPaused) return;

    // Timeline steps layout
    // step 0: Idle start screen -> types 1st msg into input
    // step 1: 1st User msg posted -> AFTER typing indicator
    // step 2: AFTER 1st Response (Text block)
    // step 3: Risk Breakdown Card reveals
    // step 4: Action Suggestions show up
    // step 5: Types 2nd msg into input
    // step 6: 2nd User msg posted -> AFTER typing indicator
    // step 7: AFTER 2nd Response (Budget Plan breakdown)
    // step 8: Extended Pause for comprehensive reading before reset loop

    let timeoutId: NodeJS.Timeout;

    if (step === 0) {
      let charIdx = 0;
      setInputText("");
      const typingInterval = setInterval(() => {
        if (isPaused) return;
        if (charIdx <= firstUserMsg.length) {
          setInputText(firstUserMsg.slice(0, charIdx));
          charIdx++;
        } else {
          clearInterval(typingInterval);
          timeoutId = setTimeout(() => {
            setInputText("");
            setStep(1);
          }, 400);
        }
      }, 30);
      return () => clearInterval(typingInterval);
    } else if (step === 1) {
      timeoutId = setTimeout(() => setStep(2), 2500);
    } else if (step === 2) {
      timeoutId = setTimeout(() => setStep(3), 3000);
    } else if (step === 3) {
      timeoutId = setTimeout(() => setStep(4), 3000);
    } else if (step === 4) {
      let charIdx = 0;
      setInputText("");
      const typingInterval = setInterval(() => {
        if (isPaused) return;
        if (charIdx <= secondUserMsg.length) {
          setInputText(secondUserMsg.slice(0, charIdx));
          charIdx++;
        } else {
          clearInterval(typingInterval);
          timeoutId = setTimeout(() => {
            setInputText("");
            setStep(5);
          }, 400);
        }
      }, 35);
      return () => clearInterval(typingInterval);
    } else if (step === 5) {
      timeoutId = setTimeout(() => setStep(6), 2500);
    } else if (step === 6) {
      timeoutId = setTimeout(() => setStep(7), 4000);
    } else if (step === 7) {
      // Extended reading pause before loop resets
      timeoutId = setTimeout(() => setStep(0), 10000);
    }

    return () => clearTimeout(timeoutId);
  }, [step, isPaused]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative mx-auto mt-16 max-w-5xl overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white shadow-2xl shadow-black/[0.08]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/[0.07] px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black font-heading text-white">
            a.
          </div>
          <div>
            <p className="font-semibold">after.</p>
            <p className="text-xs text-neutral-400">
              Your financial decision companion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {isPaused && (
            <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-600 border border-amber-200/60">
              Paused (Reading)
            </span>
          )}
          <div className="flex items-center gap-2 text-green-600">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Online
          </div>
        </div>
      </div>

      {/* Chat Canvas */}
      <div
        ref={chatContainerRef}
        className="relative max-h-[620px] min-h-[560px] overflow-y-auto bg-[#f8f7f3] p-5 sm:p-8"
      >
        <AnimatePresence mode="wait">
          {step === 0 && !inputText && (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[480px] items-center justify-center"
            >
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black font-heading text-2xl text-white shadow-lg">
                  a.
                </div>
                <h3 className="mt-5 font-heading text-3xl">
                  What are you thinking about?
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  Watch how AFTER turns complex money thoughts into clear,
                  actionable decisions.
                </p>
              </div>
            </motion.div>
          )}

          {(step > 0 || inputText.length > 0) && (
            <motion.div
              key="conversation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 pb-4"
            >
              {/* First User Message */}
              {step >= 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex justify-end"
                >
                  <div className="max-w-xl rounded-2xl rounded-br-md bg-[#7657ff] px-5 py-4 text-sm leading-6 text-white sm:text-base shadow-sm">
                    {firstUserMsg}
                  </div>
                </motion.div>
              )}

              {/* Typing Indicator for AFTER Turn 1 */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <TypingIndicator />
                </motion.div>
              )}

              {/* AFTER Turn 1 Response */}
              {step >= 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-start"
                >
                  <div className="max-w-2xl rounded-2xl rounded-bl-md bg-white px-5 py-4 text-sm leading-7 shadow-sm sm:text-base border border-black/[0.04]">
                    <p>
                      I understand why you want it. But based on what you've
                      told me, buying an ₦8m car right now carries severe risk.
                    </p>

                    {/* Risk Stats Card */}
                    {step >= 3 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mt-5 overflow-hidden rounded-2xl border border-red-100 bg-red-50/70 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-red-500">
                              Financial risk assessment
                            </p>
                            <p className="mt-0.5 text-xl font-semibold text-red-700">
                              Critical (-₦4.0m Deficit)
                            </p>
                          </div>
                          <div className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                            High risk
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                          <FinancialStat
                            label="Monthly Surplus"
                            value="₦500,000"
                          />
                          <FinancialStat
                            label="Current Savings"
                            value="₦4,000,000"
                          />
                          <FinancialStat
                            label="Post-Purchase Reserve"
                            value="-₦4,000,000"
                            danger
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Suggested Next Steps */}
                    {step >= 4 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mt-5"
                      >
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          Recommended next steps
                        </p>
                        <div className="space-y-2">
                          <ActionSuggestion text="Calculate safe car budget" />
                          <ActionSuggestion text="Explore car savings timeline" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Second User Message */}
              {step >= 5 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex justify-end"
                >
                  <div className="max-w-xl rounded-2xl rounded-br-md bg-[#7657ff] px-5 py-4 text-sm leading-6 text-white sm:text-base shadow-sm">
                    {secondUserMsg}
                  </div>
                </motion.div>
              )}

              {/* Typing Indicator for AFTER Turn 2 */}
              {step === 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <TypingIndicator />
                </motion.div>
              )}

              {/* AFTER Turn 2 Response */}
              {step >= 6 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-start"
                >
                  <div className="max-w-2xl rounded-2xl rounded-bl-md bg-white px-5 py-4 text-sm leading-7 shadow-sm sm:text-base border border-black/[0.04]">
                    <p>
                      To protect yourself, you should keep an emergency buffer
                      of at least ₦2.1m (3 months of your ₦700k expenses).
                    </p>

                    {step >= 7 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                          Recommended Budget Range
                        </p>
                        <p className="mt-1 text-2xl font-bold text-emerald-800">
                          ₦1.5m – ₦1.9m
                        </p>
                        <p className="mt-2 text-xs leading-5 text-emerald-800/80">
                          This range lets you pay outright cash while preserving
                          your ₦2.1m emergency fund. Alternatively, saving your
                          ₦500k monthly surplus allows you to buy the ₦8m car in
                          just 8 months.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic Input Bar */}
      <div className="border-t border-black/[0.07] bg-white p-4 sm:p-5">
        <div className="flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 py-3">
          <span className="flex-1 text-sm text-neutral-800 font-mono sm:font-sans">
            {inputText ? (
              <span className="text-black">{inputText}</span>
            ) : (
              <span className="text-neutral-400">
                Ask AFTER anything about your money...
              </span>
            )}
            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-[#7657ff]" />
          </span>

          <motion.div
            animate={{ scale: inputText ? 1.05 : 1 }}
            className={`rounded-xl p-2 text-white transition ${
              inputText ? "bg-[#7657ff]" : "bg-black"
            }`}
          >
            <Send size={16} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}