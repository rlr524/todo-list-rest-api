import { Item } from "../models/item";
import { Request, Response } from "express";
import { Types } from "mongoose";
import logger from "../utils/logger";

const ItemService = {
	async getItems(req: Request, res: Response): Promise<void> {
		const items = await Item.find({});
		res.json(items);
		logger.info(`get items invoked - from ${req.host}`);
	},

	async getItemById(req: Request, res: Response): Promise<void> {
		const id = new Types.ObjectId(req.params.id);

		try {
			const item = await Item.findById(id);

			if (!item) {
				res.json(
					`get item by id invoked - item with the id of ${id} not found`
				);
				logger.info(
					`get item by id invoked - unsuccessful on item id ${id} from ${req.host}`
				);
				return;
			}

			res.json(item);
			logger.info(
				`get item by id invoked - on item id ${id} from ${req.host}`
			);
		} catch (err: unknown) {
			if (err instanceof Error && err.name === "CastError") {
				res.json(`invalid id format`);
				logger.error(
					`get item by id invoked - invalid id format: ${err.message} from ${req.host}`
				);
			} else {
				res.json(`an unknown error occurred`);
				if (err instanceof Error) {
					logger.error(
						`get item by id invoked - an unknown error occurred: ${err.message} from ${req.host}`
					);
				} else {
					logger.error(
						`get item by id invoked - an unknown error occurred: ${JSON.stringify(
							err
						)} from ${req.host}`
					);
				}
			}
		}
	},

	async createItem(req: Request, res: Response): Promise<void> {
		const body = req.body;

		const item = await Item.insertOne({
			title: body.title,
			description: body.description,
			due: body.due,
			complete: (body.complete = false),
			owner: body.owner ? body.owner : (body.owber = "Rob"),
			deleted: (body.deleted = false),
		});

		res.json(item);
		logger.info(
			`create item invoked - returning id ${item.id} from ${req.host}`
		);
	},

	async updateItem(req: Request, res: Response): Promise<void> {
		const id = req.body.id;
		const { title, description, due, complete, owner } = req.body;

		try {
			const item = await Item.findOneAndUpdate(
				{ _id: id },
				{
					title: title,
					description: description,
					due: due,
					complete: complete,
					owner: owner,
					deleted: false,
				},
				{ new: true }
			);

			if (!item) {
				res.json(`item with the id of ${id} not found`);
				logger.info(
					`update item invoked - item with the id of ${id} not found from ${req.host}`
				);
				return;
			}

			res.json(item);
			logger.info(
				`update item invoked - item with id ${id} from ${req.host}`
			);
		} catch (err: unknown) {
			if (err instanceof Error && err.name === "CastError") {
				res.json(`invalid id format`);
				logger.error(
					`update item invoked - invalid id format: ${err.message} from ${req.host}`
				);
			} else {
				res.json(`an unknown error occurred`);
				if (err instanceof Error) {
					logger.error(
						`update item invoked - an unknown error occurred: ${err.message} from ${req.host}`
					);
				} else {
					logger.error(
						`update item invoked - an unknown error occurred: ${JSON.stringify(
							err
						)} from ${req.host}`
					);
				}
			}
		}
	},

	async deleteItem(req: Request, res: Response): Promise<void> {
		const id = new Types.ObjectId(req.params.id);

		try {
			const item = await Item.findOneAndUpdate(
				{ _id: id },
				{
					deleted: true,
				},
				{ new: true }
			);

			if (!item) {
				res.json(`item with the id of ${id} not found`);
				logger.info(
					`delete item invoked - item with the id of ${id} not found from ${req.host}`
				);
				return;
			}

			res.json(item);
			logger.info(`delete item invoked - item with the id ${id}`);
		} catch (err: unknown) {
			if (err instanceof Error && err.name === "CastError") {
				res.json(`invalid id format`);
				logger.error(
					`delete item invoked - invalid id format: ${err.message} from ${req.host}`
				);
			} else {
				res.json(`an unknown error occurred`);
				if (err instanceof Error) {
					logger.error(
						`delete item invoked - an unknown error occurred: ${err.message} from ${req.host}`
					);
				} else {
					logger.error(
						`delete item invoked - an unknown error occurred: ${JSON.stringify(
							err
						)} from ${req.host}`
					);
				}
			}
		}
	},
};

export default ItemService;
