import { Schema, model } from "mongoose";

interface IItem {
	title: string;
	description: string;
	due: string;
	importance: string;
	complete: boolean;
	owner: string;
	deleted: boolean;
}

const itemSchema = new Schema<IItem>(
	{
		title: { type: String, required: true },
		description: { type: String, required: false },
		due: { type: String, required: false },
		importance: { type: String, required: false },
		complete: { type: Boolean, required: false },
		owner: { type: String, required: true },
		deleted: { type: Boolean, required: true },
	},
	{ toJSON: {virtuals: true}, timestamps: true},
);

export const Item = model<IItem>("Item", itemSchema);
