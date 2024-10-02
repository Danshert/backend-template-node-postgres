import { CustomError } from '../../domain';

import { prisma } from '../../data/postgres';
import { ReminderTime, Task } from '@prisma/client';

import { WssService } from './wss.service';

import { NotificationEntity } from '../../domain/entities';

import { GetNotificationsDto, PaginationDto } from '../../domain/dtos';

import {
	addMinutes,
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	format,
	isEqual,
	startOfDay,
	startOfToday,
	subDays,
} from 'date-fns';

export class NotificationService {
	// eslint-disable-next-line no-unused-vars
	constructor(private readonly wssService = WssService.instance) {}

	async findById(id: string, userId: string) {
		const notification = await prisma.notification.findFirst({
			where: { id },
		});

		if (!notification) {
			throw CustomError.notFound(`Notification with ID:${id} not found.`);
		}

		if (notification.userId.toString() !== userId) {
			throw CustomError.unauthorized(
				`You cannot access to this notification.`,
			);
		}

		return notification;
	}

	async getNotifications(
		getNotificationsDto: GetNotificationsDto,
		paginationDto: PaginationDto,
	) {
		const { page, limit } = paginationDto;

		try {
			const [total, notifications] = await Promise.all([
				prisma.notification.count({
					where: {
						userId: getNotificationsDto.userId,
						boardId: getNotificationsDto.boardId,
					},
				}),
				prisma.notification.findMany({
					where: {
						userId: getNotificationsDto.userId,
						boardId: getNotificationsDto.boardId,
					},
				}),
			]);

			return {
				page,
				lastPage: Math.ceil(total / limit) || 1,
				limit,
				total,
				prev:
					page > 1
						? `/api/labels?page=${page - 1}&limit=${limit}`
						: null,
				next:
					page < Math.ceil(total / limit)
						? `/api/labels?page=${page + 1}&limit=${limit}`
						: null,
				notifications: notifications.map((notification) =>
					NotificationEntity.fromObject(notification),
				),
			};
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}

	async markNotificationAsSeen(id: string, userId: string) {
		await this.findById(id, userId.toString());

		try {
			const notificationUpdated = await prisma.notification.update({
				where: { id },
				data: { seen: true },
			});

			return NotificationEntity.fromObject(notificationUpdated!);
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}

	private async createNotification(task: Task, message: string) {
		try {
			await prisma.task.update({
				where: { id: task.id },
				data: { notificationCreated: true },
			});

			const notification = await prisma.notification.create({
				data: {
					userId: task.userId,
					boardId: task.boardId,
					taskId: task.id,
					message,
				},
			});

			this.wssService.sendMessage('new-notification', {
				userId: task.userId.toString(),
				...NotificationEntity.fromObject(notification),
			});
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}

	async checkDueDatesOfTasks() {
		const tasks = await prisma.task.findMany({
			where: {
				notificationCreated: false,
				endDate: {
					not: null,
					gte: subDays(Date.now(), 2),
					lte: addMinutes(Date.now(), 6),
				},
			},
		});

		if (tasks) {
			await tasks.forEach(async (task) => {
				let message;

				if (task.reminderTime === ReminderTime.DUE_DATE) {
					if (isEqual(startOfToday(), startOfDay(task.endDate!))) {
						message = `La tarea ${task.title}, finaliza el día de hoy a las ${format(task.createdAt, 'p')}`;
					}
				}

				if (task.reminderTime.includes('MINS')) {
					const mins = parseInt(task.reminderTime.split('_')[1]);
					const diffInMins = differenceInMinutes(
						task.endDate!,
						Date.now(),
					);

					if (diffInMins <= mins) {
						message = `La tarea ${task.title}, finaliza en ${diffInMins} minutos`;
					}
				}

				if (task.reminderTime.includes('HOUR')) {
					const hrs = parseInt(task.reminderTime.split(' ')[1]);
					const diffInHrs = differenceInHours(
						task.endDate!,
						Date.now(),
					);

					if (diffInHrs <= hrs) {
						message = `La tarea ${task.title}, finaliza en ${diffInHrs} ${hrs === 1 ? 'hora' : 'horas'}`;
					}
				}

				if (task.reminderTime.includes('DAY')) {
					const days = parseInt(task.reminderTime.split(' ')[1]);
					const diffInDays = differenceInDays(
						task.endDate!,
						Date.now(),
					);

					if (diffInDays <= days) {
						message = `La tarea ${task.title} finaliza en ${days} ${days === 1 ? 'día' : 'días'}`;
					}
				}

				if (message) {
					await this.createNotification(task, message);
				}
			});
		}
	}
}
