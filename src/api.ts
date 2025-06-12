import express, { Router } from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import connectDB from "./utils/db";
import ItemService from "./services/itemService";
import { logger } from "./utils/logger";
import verifyApiKey from "./middlewares/auth";

const api = express();
const router = Router();
const port = process.env.PORT;

const version = process.env.API_VERSION;

connectDB().catch((err) => logger.error(err));

api.use(cors());
api.use(helmet());
api.use(express.json());

router.get("/", (req, res) => {
	res.send("Hello, Madison");
});

api.use(verifyApiKey)

router.get(`/items`, ItemService.getItems);
router.get(`/item/:id`, ItemService.getItemById);
router.post(`/item`, ItemService.createItem);
router.patch(`/item`, ItemService.updateItem);
router.delete(`/item/:id`, ItemService.deleteItem);

api.use(`/api/${version}`, router);

api.listen(port, () => {
	console.log(`App listening on ${port}`);
})