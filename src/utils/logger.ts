import { createLogger, format, transports } from "winston";

const { combine, timestamp, label, printf } = format;

const loggerFormat = printf(({ level, message, label, timestamp }) => {
	return `${timestamp} [${label}] ${level}, ${message}`;
});

export const logger = createLogger({
	format: combine(label({ label: "logger" }), timestamp(), loggerFormat),
	transports: [new transports.File({ filename: "combined.log" })],
});
