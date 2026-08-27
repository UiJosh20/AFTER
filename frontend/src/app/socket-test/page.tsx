"use client";

import { socket } from "@/lib/socket";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  sender: "user" | "agent" | "system";
  text: string;
  isStreaming?: boolean;
}

const DEVICE_ID = "test-device-001";

export default function SocketTestPage() {
  const [status, setStatus] = useState("Disconnected");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Queue to store incoming chunks for smooth typewriter rendering
  const chunkQueueRef = useRef<string[]>([]);
  const isTypingRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSpeaking]);

  // Process chunk queue character by character (or word by word)
  useEffect(() => {
    const interval = setInterval(() => {
      if (chunkQueueRef.current.length > 0) {
        isTypingRef.current = true;
        setIsSpeaking(true);

        const nextChunk = chunkQueueRef.current.shift();
        if (!nextChunk) return;

        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];

          if (lastMsg && lastMsg.sender === "agent" && lastMsg.isStreaming) {
            return [
              ...prev.slice(0, -1),
              { ...lastMsg, text: lastMsg.text + nextChunk },
            ];
          }

          return [
            ...prev,
            {
              id: crypto.randomUUID(),
              sender: "agent",
              text: nextChunk,
              isStreaming: true,
            },
          ];
        });
      } else if (isTypingRef.current && chunkQueueRef.current.length === 0) {
        // Queue empty, finish active streaming bubble
        isTypingRef.current = false;
        setIsSpeaking(false);

        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.sender === "agent" && lastMsg.isStreaming) {
            return [
              ...prev.slice(0, -1),
              { ...lastMsg, isStreaming: false },
            ];
          }
          return prev;
        });
      }
    }, 20); // Adjust interval speed (ms) for faster/slower typing

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      setStatus("Connected");
      socket.emit("join:device", DEVICE_ID);
    };

    const onDisconnect = () => {
      setStatus("Disconnected");
    };

    const onThinking = () => {
      setIsSpeaking(true);
    };

    const onResponseChunk = (data: { content: string }) => {
      // Split large chunks into individual characters for smooth word-by-word streaming
      const chars = data.content.split("");
      chunkQueueRef.current.push(...chars);
    };

    const onResponseComplete = () => {
      // Wait for queue drain; completion handler inside setInterval closes the bubble
    };

    const onError = (data: { message: string }) => {
      setIsSpeaking(false);
      chunkQueueRef.current = [];
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "system",
          text: `Error: ${data.message}`,
        },
      ]);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("agent:thinking", onThinking);
    socket.on("agent:response:chunk", onResponseChunk);
    socket.on("agent:response:complete", onResponseComplete);
    socket.on("agent:error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("agent:thinking", onThinking);
      socket.off("agent:response:chunk", onResponseChunk);
      socket.off("agent:response:complete", onResponseComplete);
      socket.off("agent:error", onError);
    };
  }, []);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage("");

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender: "user", text: userText },
    ]);

    socket.emit("agent:message", {
      deviceId: DEVICE_ID,
      message: userText,
    });
  };

  return (
    <main className="mx-auto flex h-screen max-w-2xl flex-col bg-neutral-950 text-white">
      {/* Header with Avatar */}
      <header className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center">
            {isSpeaking && (
              <>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7657ff] opacity-75" />
                <span className="absolute inline-flex h-12 w-12 animate-pulse rounded-full bg-[#7657ff]/30" />
              </>
            )}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#7657ff] font-bold text-white shadow-md">
              A
            </div>
          </div>

          <div>
            <h1 className="text-sm font-semibold tracking-wide">AFTER</h1>
            <p className="text-xs text-neutral-400">
              {isSpeaking ? (
                <span className="font-medium text-[#7657ff]">Thinking...</span>
              ) : (
                status
              )}
            </p>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((item) => {
          if (item.sender === "user") {
            return (
              <div key={item.id} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl bg-[#7657ff] px-4 py-3 text-sm text-white shadow-sm">
                  {item.text}
                </div>
              </div>
            );
          }

          if (item.sender === "system") {
            return (
              <div key={item.id} className="flex justify-center">
                <div className="rounded-lg border border-red-900/50 bg-red-950 px-3 py-1.5 text-xs text-red-400">
                  {item.text}
                </div>
              </div>
            );
          }

          return (
            <div key={item.id} className="flex items-start gap-3">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7657ff] text-xs font-bold text-white">
                A
                {item.isStreaming && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 animate-bounce rounded-full bg-green-400" />
                )}
              </div>

              <div className="max-w-[80%] rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-neutral-200 shadow-sm">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {item.text}
                  {item.isStreaming && (
                    <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-[#7657ff]" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-neutral-800 bg-neutral-900 p-4 flex gap-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask AFTER anything..."
          className="flex-1 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#7657ff]"
        />
        <button
          type="submit"
          className="rounded-xl bg-[#7657ff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6242ea]"
        >
          Send
        </button>
      </form>
    </main>
  );
}