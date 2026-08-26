import { Types } from "mongoose";

import { User } from "../../models/user.model.js";
import { FinancialProfile } from "../../models/financial-profile.model.js";
import { Conversation } from "../../models/conversation.model.js";
import { Message } from "../../models/message.model.js";

export async function getOrCreateUser(
  deviceId: string
) {
  console.log(
    `[Memory]: Looking up user for device ${deviceId}`
  );

  let user = await User.findOne({
    deviceId,
  });

  if (user) {
    console.log(
      `[Memory]: Existing user found: ${user._id}`
    );

    return user;
  }

  console.log(
    "[Memory]: User not found. Creating new user..."
  );

  user = await User.create({
    deviceId,
  });

  console.log(
    `[Memory]: User created: ${user._id}`
  );

  return user;
}

export async function getOrCreateFinancialProfile(
  userId: Types.ObjectId
) {
  console.log(
    `[Memory]: Loading financial profile for user ${userId}...`
  );

  let profile =
    await FinancialProfile.findOne({
      userId,
    });

  if (profile) {
    console.log(
      "[Memory]: Financial profile found."
    );

    return profile;
  }

  console.log(
    "[Memory]: Financial profile not found. Creating..."
  );

  profile = await FinancialProfile.create({
    userId,

    monthlyIncome: null,
    monthlyExpenses: null,
    savings: null,
    investments: null,
    totalDebt: null,
    monthlyDebtPayments: null,
  });

  console.log(
    `[Memory]: Financial profile created: ${profile._id}`
  );

  return profile;
}
export async function getOrCreateConversation(
  userId: Types.ObjectId
) {
  console.log(
    `[Memory]: Loading conversation for user ${userId}`
  );

  let conversation = await Conversation.findOne({
    userId,
  }).sort({
    updatedAt: -1,
  });

  if (conversation) {
    console.log(
      `[Memory]: Existing conversation found: ${conversation._id}`
    );

    return conversation;
  }

  console.log(
    "[Memory]: Creating new conversation..."
  );

  conversation = await Conversation.create({
    userId,
    title: "AFTER",
  });

  console.log(
    `[Memory]: Conversation created: ${conversation._id}`
  );

  return conversation;
}

export async function saveMessage(
  userId: Types.ObjectId,
  conversationId: Types.ObjectId,
  role: "user" | "assistant" | "system",
  content: string
) {
  console.log(
    `[Memory]: Saving ${role} message for user ${userId}...`
  );

  const message = await Message.create({
    userId,
    conversationId,
    role,
    content,
  });

  console.log(
    `[Memory]: ${role} message saved: ${message._id}`
  );

  return message;
}

export async function getConversationMessages(
  conversationId: Types.ObjectId
) {
  console.log(
    `[Memory]: Loading conversation history for ${conversationId}...`
  );

  const messages = await Message.find({
    conversationId,
  })
    .sort({
      createdAt: 1,
    })
    .lean();

  console.log(
    `[Memory]: Loaded ${messages.length} messages.`
  );

  return messages;
}