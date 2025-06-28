import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import logger from "../utils/logger";

const storedKey: string | undefined = process.env.API_KEY;

const verifyApiKey = (req: Request, res: Response, next: NextFunction) => {
	const apiKey = req.headers["x-api-key"];
	if (apiKey === storedKey) {
		next();
	} else if (!apiKey || apiKey !== storedKey) {
		logger.error(`invalid API key attempt from ${req.host}`);
		res.status(400).json({ message: "Unauthorized: invalid API key" });
	} else {
		logger.error(`unknown error validating access from ${req.host}`);
		res.status(400).json({ message: "Unknown error" });
	}
};

export default verifyApiKey;
