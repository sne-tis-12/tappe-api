import express from "express";
const vendorRouter = express.Router()

import { vendorController } from "../controllers/vendor.controller.js";
import { authMiddleware, isVendor } from "../middlewares/auth.middleware.js";

vendorRouter.get("/", vendorController.home);
vendorRouter.post("/login", vendorController.login);
vendorRouter.post("/register", vendorController.register);
vendorRouter.get("/products", authMiddleware, isVendor, vendorController.getProducts);
vendorRouter.post("/products/add", authMiddleware, isVendor, vendorController.addProduct);
vendorRouter.get("/products/:id", authMiddleware, isVendor, vendorController.getProduct);
vendorRouter.put("/products/:id/edit", authMiddleware, isVendor, vendorController.updateProduct);
vendorRouter.delete("/products/:id/delete", authMiddleware, isVendor, vendorController.deleteProduct);

export default vendorRouter;