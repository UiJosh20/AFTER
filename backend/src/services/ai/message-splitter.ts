/**
 * message-splitter.ts
 *
 * Wraps the raw Gemini token stream and re-emits it as a sequence of
 * "chunk" events (append to the current bubble) and "part-complete" events
 * (finalize the current bubble, next chunk starts a new one). This is what
 * turns one long model response into several short WhatsApp-style bubbles.
 */

import { MESSAGE_DELIMITER } from "./message-format.js";

export type StreamEvent =
  | { type: "chunk"; content: string }
  | { type: "part-complete"; content: string };

export async function* splitIntoParts(
  source: AsyncGenerator<string>
): AsyncGenerator<StreamEvent> {
  let buffer = "";
  let currentPart = "";

  for await (const rawChunk of source) {
    buffer += rawChunk;

    let delimiterIndex: number;
    while ((delimiterIndex = buffer.indexOf(MESSAGE_DELIMITER)) !== -1) {
      const before = buffer.slice(0, delimiterIndex);
      if (before) {
        currentPart += before;
        yield { type: "chunk", content: before };
      }
      buffer = buffer.slice(delimiterIndex + MESSAGE_DELIMITER.length);

      const finished = currentPart.trim();
      currentPart = "";
      if (finished) {
        yield { type: "part-complete", content: finished };
      }
    }

    if (buffer) {
      currentPart += buffer;
      yield { type: "chunk", content: buffer };
      buffer = "";
    }
  }

  const finished = currentPart.trim();
  if (finished) {
    yield { type: "part-complete", content: finished };
  }
}