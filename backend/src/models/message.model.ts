import mongoose, {
  Document,
  Schema,
  Types,
} from "mongoose";

export type MessageRole =
  | "user"
  | "assistant"
  | "system";

export interface IMessage extends Document {
  userId: Types.ObjectId;
  conversationId: Types.ObjectId;
  role: MessageRole;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({
  conversationId: 1,
  createdAt: 1,
});

MessageSchema.index({
  userId: 1,
  createdAt: -1,
});

export const Message = mongoose.model<IMessage>(
  "Message",
  MessageSchema
);