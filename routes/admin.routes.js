import express from "express";
const adminRouter = express.Router();

import { adminController } from "../controllers/admin.controller.js";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";

adminRouter.get("/", adminController.home);
adminRouter.post("/login", adminController.login);
adminRouter.post("/register", adminController.register);
adminRouter.post("/logout", adminController.logout);
adminRouter.post(
  "/activate",
  authMiddleware,
  isAdmin,
  adminController.activate
);
adminRouter.post(
  "/addBalance",
  authMiddleware,
  isAdmin,
  adminController.addBalance
);

export default adminRouter;
