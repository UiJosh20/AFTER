import { Request, Response } from "express";
import { getOrCreateDeviceUser } from "../services/auth/auth.service.js";

export async function bootstrapDeviceUser(
  req: Request,
  res: Response
) {
  try {
    const { deviceId } = req.body;

    if (!deviceId || typeof deviceId !== "string") {
      return res.status(400).json({
        success: false,
        message: "deviceId is required",
      });
    }

    const user = await getOrCreateDeviceUser(deviceId);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          deviceId: user.deviceId,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Device authentication error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to authenticate device",
    });
  }
}