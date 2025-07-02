import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import connectDB from "./utils/db";
import ItemService from "./services/itemService";
import verifyApiKey from "./middlewares/auth";
import logger from "./utils/logger";
import serverless from "serverless-http";

const app = express();
const port = process.env.PORT || "3000";

app.get("/", (req, res) => {
	res.status(200).send("Hello, Madison");
});

const version = process.env.API_VERSION;

connectDB().catch((err) => logger.error(err));

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(verifyApiKey);

app.get(`/api/${version}/items`, ItemService.getItems);
app.get(`/api/${version}/item/:id`, ItemService.getItemById);
app.post(`/api/${version}/item`, ItemService.createItem);
app.patch(`/api/${version}/item`, ItemService.updateItem);
app.delete(`/api/${version}/item/:id`, ItemService.deleteItem);

app.listen(port, () => {
	console.log(`The service has started on port ${port}`);
});

export const handler = serverless(app);
