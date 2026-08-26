import { Router } from "express";

import { bootstrapDeviceUser } from "../controllers/auth.controller.js";

const router = Router();

router.post(
  "/device",

  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Authenticate device'
    #swagger.description = 'Creates or retrieves an AFTER user using a device UUID.'
  */

  bootstrapDeviceUser
);

export default router;