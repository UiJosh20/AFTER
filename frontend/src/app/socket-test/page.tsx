/**
 * socket-test/page.tsx
 *
 * New in this version:
 *  1. Handles "agent:response:part-complete" — seals the current bubble so
 *     the next chunk starts a fresh one. This is what turns a multi-part
 *     model response into several separate WhatsApp-style bubbles instead
 *     of one long message.
 *  2. The "taking longer than expected" warning is now tracked by id and
 *     automatically removed the moment real content starts arriving, so a
 *     merely-slow-but-fine response doesn't leave a stale error sitting in
 *     the chat next to a perfectly good answer.
 *  3. Renders **bold** markers as actual <strong> text instead of literal
 *     asterisks, since the model will still occasionally emphasize a word.
 */

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
const ACK_TIMEOUT_MS = 5000;
const THINKING_TIMEOUT_MS = 20000;

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function SocketTestPage() {
  const [status, setStatus] = useState("Disconnected");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasConnectedBeforeRef = useRef(false);
  const lastSyncAtRef = useRef<number>(Date.now());
  const thinkingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stuckWarningIdRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSpeaking]);

  const clearThinkingTimeout = () => {
    if (thinkingTimeoutRef.current) {
      clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
  };

  const pushSystemMessage = (text: string) => {
    const id = crypto.randomUUID();
    setMessages((prev) => [...prev, { id, sender: "system", text }]);
    return id;
  };

  // Called whenever real content arrives — retracts the stuck-thinking
  // warning if one was showing, since it clearly wasn't actually stuck.
  const dismissStuckWarningIfAny = () => {
    if (stuckWarningIdRef.current) {
      const idToRemove = stuckWarningIdRef.current;
      stuckWarningIdRef.current = null;
      setMessages((prev) => prev.filter((m) => m.id !== idToRemove));
    }
  };

  const finalizeCurrentBubble = () => {
    setMessages((prev) => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg && lastMsg.sender === "agent" && lastMsg.isStreaming) {
        return [...prev.slice(0, -1), { ...lastMsg, isStreaming: false }];
      }
      return prev;
    });
  };

  useEffect(() => {
    const onConnect = () => {
      console.log("[Socket Client]: Connected", socket.id);
      setStatus("Connected");
      socket.emit("join:device", DEVICE_ID);

      if (hasConnectedBeforeRef.current) {
        socket.emit(
          "agent:sync",
          { deviceId: DEVICE_ID, since: lastSyncAtRef.current },
          (data: { messages: any[] }) => {
            const missed = data?.messages ?? [];
            if (missed.length > 0) {
              setMessages((prev) => [
                ...prev,
                ...missed.map((m: any) => ({
                  id: String(m._id ?? crypto.randomUUID()),
                  sender: "agent" as const,
                  text: m.content ?? "",
                })),
              ]);
              lastSyncAtRef.current = Date.now();
            }
          }
        );
      }
      hasConnectedBeforeRef.current = true;
    };

    const onDisconnect = (reason: string) => {
      console.log("[Socket Client]: Disconnected", reason);
      setStatus("Disconnected");
      setIsSpeaking(false);
      clearThinkingTimeout();
    };

    const onConnectError = (err: Error) => {
      console.error("[Socket Client]: Connect error", err.message);
      setStatus("Disconnected");
    };

    const onThinking = () => {
      setIsSpeaking(true);
      clearThinkingTimeout();
      thinkingTimeoutRef.current = setTimeout(() => {
        setIsSpeaking(false);
        stuckWarningIdRef.current = pushSystemMessage(
          "This is taking longer than expected — the connection may have dropped. Try sending again."
        );
      }, THINKING_TIMEOUT_MS);
    };

    const onResponseChunk = (data: { content: string }) => {
      clearThinkingTimeout();
      dismissStuckWarningIfAny();
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.sender === "agent" && lastMsg.isStreaming) {
          return [...prev.slice(0, -1), { ...lastMsg, text: lastMsg.text + data.content }];
        }
        return [
          ...prev,
          { id: crypto.randomUUID(), sender: "agent", text: data.content, isStreaming: true },
        ];
      });
    };

    // A single bubble is done — seal it. The next chunk (if any) starts a
    // fresh bubble automatically, since it won't find a streaming message
    // to append to.
    const onPartComplete = () => {
      finalizeCurrentBubble();
    };

    const onResponseComplete = () => {
      console.log("[Socket Client]: Response complete");
      clearThinkingTimeout();
      setIsSpeaking(false);
      lastSyncAtRef.current = Date.now();
      finalizeCurrentBubble();
    };

    const onError = (data: { message: string }) => {
      console.error("[Socket Client]: Error", data);
      clearThinkingTimeout();
      setIsSpeaking(false);
      pushSystemMessage(`Error: ${data.message}`);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("agent:thinking", onThinking);
    socket.on("agent:response:chunk", onResponseChunk);
    socket.on("agent:response:part-complete", onPartComplete);
    socket.on("agent:response:complete", onResponseComplete);
    socket.on("agent:error", onError);

    if (!socket.connected) {
      console.log("[Socket Client]: Connecting...");
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("agent:thinking", onThinking);
      socket.off("agent:response:chunk", onResponseChunk);
      socket.off("agent:response:part-complete", onPartComplete);
      socket.off("agent:response:complete", onResponseComplete);
      socket.off("agent:error", onError);
      clearThinkingTimeout();
    };
  }, []);

  const sendWithAck = (text: string) => {
    let settled = false;

    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        pushSystemMessage("Message may not have been delivered — check your connection and try again.");
      }
    }, ACK_TIMEOUT_MS);

    socket.emit(
      "agent:message",
      { deviceId: DEVICE_ID, message: text },
      (ack: { received: boolean; error?: string }) => {
        settled = true;
        clearTimeout(timeout);
        if (!ack?.received) {
          pushSystemMessage(`Error: ${ack?.error ?? "delivery failed"}`);
        }
      }
    );
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage("");

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "user", text: userText }]);

    sendWithAck(userText);
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
                  {renderInlineMarkdown(item.text)}
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