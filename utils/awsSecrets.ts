import {
	GetSecretValueCommand,
	GetSecretValueCommandOutput,
	SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import "dotenv/config";
import { logger } from "../utils/logger";

let response: GetSecretValueCommandOutput;

export default async function getSecrets(): Promise<GetSecretValueCommandOutput> {
	const profile = process.env.AWS_PROFILE;

	const client = new SecretsManagerClient({
		region: "us-west-2",
		credentials: fromIni({ profile: profile }),
	});

	const params = {
		SecretId: process.env.SECRET_NAME,
	};

	try {
		response = await client.send(new GetSecretValueCommand(params));
	} catch (err: unknown) {
		logger.error("error", err);
	}

	return response;
}
