import express from "express";
const publicRouter = express.Router();

import { publicController } from "../controllers/public.controller.js";

publicRouter.get("/", publicController.home);
publicRouter.post("/products", publicController.getProducts);
publicRouter.get("/products/:id", publicController.getProduct);
publicRouter.get("/vendors", publicController.getVendors);
publicRouter.get("/vendors/:id", publicController.getVendor);