import mongoose from "mongoose";
import "dotenv/config";
import getSecrets from "./awsSecrets";

export default async function connectDB() {
	const response = await getSecrets();
	const secrets: string = response.SecretString ?? "";
	const secretValues = JSON.parse(secrets);
	const user = secretValues.MONGO_DB_USER;
	const password = secretValues.MONGO_DB_PASSWORD;

	const DB_URL = `mongodb+srv://${user}:${password}@cluster0.jnsctan.mongodb.net/todo?retryWrites=true&w=majority&appName=Cluster0`;

	await mongoose.connect(DB_URL);
}
