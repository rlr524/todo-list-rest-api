/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import connectDB from "./utils/db";
import ItemService from "./services/itemService";
import verifyApiKey from "./middlewares/auth";

const app = express();

app.get("/", (req, res) => {
	res.status(200).send("Hello, Madison");
});

const version = process.env.API_VERSION;

connectDB().catch((err) => logger.error(err));

app.use(cors());
app.use(helmet());
app.use(express.json());

setGlobalOptions({ maxInstances: 10 });

app.use(verifyApiKey);

app.get(`/api/${version}/items`, ItemService.getItems);
app.get(`/api/${version}/item/:id`, ItemService.getItemById);
app.post(`/api/${version}/item`, ItemService.createItem);
app.patch(`/api/${version}/item`, ItemService.updateItem);
app.delete(`/api/${version}/item/:id`, ItemService.deleteItem);

exports.app = functions.https.onRequest(app);
