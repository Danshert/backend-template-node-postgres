import { Request, Response } from 'express';

import { CustomError } from '../../domain';

import { NotificationService } from '../services';

import { GetNotificationsDto, PaginationDto } from '../../domain/dtos';

export class NotificationController {
	// eslint-disable-next-line no-unused-vars
	constructor(private readonly notificationService: NotificationService) {}

	private handleError = (error: unknown, response: Response) => {
		if (error instanceof CustomError) {
			return response
				.status(error.statusCode)
				.json({ error: error.message });
		}

		console.log(`${error}`);
		return response.status(500).json({ error: 'Internal server error' });
	};

	getNotifications = async (request: Request, response: Response) => {
		const [error, getNotificationsDto] = GetNotificationsDto.create({
			...request.query,
			...request.body,
			userId: request.body.user.id,
		});

		const [errorPagination, paginationDto] = PaginationDto.create({
			...request.query,
			...request.body,
		});

		if (error || errorPagination)
			return response.status(400).json({ error });

		this.notificationService
			.getNotifications(getNotificationsDto!, paginationDto!)
			.then((notifications) => response.status(201).json(notifications))
			.catch((error) => this.handleError(error, response));
	};

	markNotificationAsSeen = async (request: Request, response: Response) => {
		const id = request.params.id;
		const userId = request.body.user.id;

		if (!id) return response.status(400).json({ error: 'ID is required.' });

		this.notificationService
			.markNotificationAsSeen(id, userId)
			.then((notifications) => response.status(200).json(notifications))
			.catch((error) => this.handleError(error, response));
	};

	subscription = async (request: Request, response: Response) => {
		const userId = request.body.user.id;

		this.notificationService
			.subscription(userId, request.body)
			.then((res) => response.status(200).json(res))
			.catch((error) => this.handleError(error, response));
	};

	checkSubscription = async (request: Request, response: Response) => {
		const userId = request.body.user.id;

		this.notificationService
			.checkSubscription(userId, request.body)
			.then((res) => response.status(200).json(res))
			.catch((error) => this.handleError(error, response));
	};
}
