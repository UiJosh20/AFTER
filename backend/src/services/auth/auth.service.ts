import { User } from "../../models/user.model.js";

export async function getOrCreateDeviceUser(deviceId: string) {
  let user = await User.findOne({ deviceId });

  if (!user) {
    user = await User.create({
      deviceId,
    });
  }

  return user;
}