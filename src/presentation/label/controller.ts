import { Request, Response } from 'express';

import { LabelService } from '../services';

import {
	CreateLabelDto,
	GetLabelDto,
	GetLabelsDto,
	UpdateLabelDto,
} from '../../domain/dtos/';

import { CustomError } from '../../domain/errors';

export class LabelController {
	// eslint-disable-next-line no-unused-vars
	constructor(private readonly labelService: LabelService) {}

	private handleError = (error: unknown, response: Response) => {
		if (error instanceof CustomError) {
			return response
				.status(error.statusCode)
				.json({ error: error.message });
		}

		console.log(`${error}`);
		return response.status(500).json({ error: 'Internal server error' });
	};

	getLabels = async (request: Request, response: Response) => {
		const boardId = request.params.id;

		const [error, getLabelsDto] = GetLabelsDto.create({
			userId: request.body.user.id,
			boardId,
		});

		if (error) return response.status(400).json({ error });

		this.labelService
			.getLabels(getLabelsDto!)
			.then((labels) => response.status(200).json(labels))
			.catch((error) => this.handleError(error, response));
	};

	createLabel = (request: Request, response: Response) => {
		const [error, createLabelDto] = CreateLabelDto.create({
			...request.query,
			...request.body,
			userId: request.body.user.id,
		});

		if (error) return response.status(400).json({ error });

		this.labelService
			.createLabel(createLabelDto!)
			.then((label) => response.status(201).json(label))
			.catch((error) => this.handleError(error, response));
	};

	updateLabel = (request: Request, response: Response) => {
		const id = request.params.id;

		const [error, updateLabelDto] = UpdateLabelDto.create({
			...request.query,
			...request.body,
			userId: request.body.user.id,
			id,
		});

		if (error) return response.status(400).json({ error });

		this.labelService
			.updateLabel(updateLabelDto!)
			.then((label) => response.status(200).json(label))
			.catch((error) => this.handleError(error, response));
	};

	deleteLabel = (request: Request, response: Response) => {
		const id = request.params.id;

		const [error, getLabelDto] = GetLabelDto.create({
			userId: request.body.user.id,
			id,
		});

		if (error) return response.status(400).json({ error });

		this.labelService
			.deleteLabel(getLabelDto!)
			.then((label) => response.status(200).json(label))
			.catch((error) => this.handleError(error, response));
	};
}
