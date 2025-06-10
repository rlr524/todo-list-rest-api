import express, { Router } from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import connectDB from "../../utils/db";
import ItemService from "../../services/itemService";
import { logger } from "../../utils/logger";
import verifyApiKey from "../../middlewares/auth";
import serverless from "serverless-http";

const api = express();
const router = Router();

const version = process.env.API_VERSION;

connectDB().catch((err) => logger.error(err));

api.use(cors());
api.use(helmet());
api.use(express.json());

router.get("/", (req, res) => {
	res.send("Hello, Madison");
});

api.use(verifyApiKey);

api.use(`/api/${version}`, router);

api.get(`/items`, ItemService.getItems);
api.get(`/item/:id`, ItemService.getItemById);
api.post(`/item`, ItemService.createItem);
api.patch(`/item`, ItemService.updateItem);
api.delete(`/item/:id`, ItemService.deleteItem);

export const handler = serverless(api);
