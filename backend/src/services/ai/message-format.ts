/**
 * message-format.ts
 *
 * The model is instructed (see response.service.ts) to separate distinct
 * thoughts with this delimiter on its own line. The socket layer splits on
 * it to emit multiple short chat bubbles instead of one long message — the
 * "WhatsApp" behavior instead of "written report" behavior.
 */

export const MESSAGE_DELIMITER = "|||";