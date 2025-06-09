import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import connectDB from "./db";
import ItemService from "./services/itemService";
import { logger } from "./logger";
import verifyApiKey from "./middlewares/auth";

const app = express();
const port = process.env.PORT;
const version = process.env.API_VERSION;

connectDB().catch((err) => logger.error(err));

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(verifyApiKey);

app.get("/", (req, res) => {
	res.send("Hello, Madison");
});

app.get(`/api/${version}/items`, ItemService.getItems);
app.get(`/api/${version}/item/:id`, ItemService.getItemById);
app.post(`/api/${version}/item`, ItemService.createItem);
app.patch(`/api/${version}/item`, ItemService.updateItem);
app.delete(`/api/${version}/item/:id`, ItemService.deleteItem);

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
