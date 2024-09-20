import { prisma } from '../../data/postgres';

import { TaskEntity } from '../../domain/entities';

import { CustomError } from '../../domain/errors';

import {
	CreateTaskDto,
	GetTaskDto,
	GetTasksDto,
	UpdateTaskDto,
} from '../../domain/dtos/task';

import { PaginationDto } from '../../domain/dtos/shared';

export class TaskService {
	constructor() {}

	async findById(id: string, userId: string) {
		const task = await prisma.task.findFirst({
			where: { id },
			include: {
				labels: {
					select: {
						label: {
							select: {
								id: true,
								name: true,
								color: true,
							},
						},
					},
				},
			},
		});

		if (!task) {
			throw CustomError.notFound(`Task with id ${id} not found.`);
		}

		if (task.userId !== userId) {
			throw CustomError.unauthorized(`You cannot access to this task.`);
		}

		return task;
	}

	async getTasks(getTaskDto: GetTasksDto, paginationDto: PaginationDto) {
		const { userId, boardId, isActive, status } = getTaskDto;
		const { page, limit } = paginationDto;

		try {
			const [total, tasks] = await Promise.all([
				prisma.task.count({
					where: {
						userId: userId,
						boardId: boardId,
						isActive: isActive,
						status: status,
					},
				}),
				prisma.task.findMany({
					where: {
						userId: userId,
						boardId: boardId,
						isActive: isActive,
						status: status,
					},
					include: {
						labels: {
							select: {
								label: {
									select: {
										id: true,
										name: true,
										color: true,
									},
								},
							},
						},
					},
					skip: (page - 1) * limit,
					take: limit,
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
				tasks: tasks.map((task) => TaskEntity.fromObject(task)),
			};
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}

	async getTaskById(getTaskDto: GetTaskDto) {
		const task = await this.findById(getTaskDto.id, getTaskDto.userId);

		return TaskEntity.fromObject(task);
	}

	async createTask(createTaskDto: CreateTaskDto) {
		try {
			const task = await prisma.task.create({
				data: createTaskDto,
				include: {
					labels: {
						select: {
							label: {
								select: {
									id: true,
									name: true,
									color: true,
								},
							},
						},
					},
				},
			});

			return TaskEntity.fromObject(task);
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}

	async updateTask(updateTaskDto: UpdateTaskDto) {
		const task = await this.findById(
			updateTaskDto.id,
			updateTaskDto.userId.toString(),
		);

		const labelsTask = [...task.labels.map((label) => label.label.id)];

		const labelsToAdd: string[] = [];
		const labelsToRemove: string[] = [];

		const { labels, ...data } = updateTaskDto;

		labelsTask.forEach((labelId) => {
			if (!labels.includes(labelId)) {
				labelsToRemove.push(labelId);
			}
		});

		labels.forEach((labelId) => {
			if (!labelsTask.includes(labelId)) {
				labelsToAdd.push(labelId);
			}
		});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const labelsToAddPromises: Promise<{ [key: string]: any }>[] = [];

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const labelsToRemovePromises: Promise<{ [key: string]: any }>[] = [];

		labelsToAdd.forEach((labelId) =>
			labelsToAddPromises.push(
				prisma.labelsOnTask.create({
					data: {
						labelId: labelId,
						taskId: task.id,
					},
				}),
			),
		);

		labelsToRemove.forEach((labelId) =>
			labelsToRemovePromises.push(
				prisma.labelsOnTask.delete({
					where: {
						labelId_taskId: {
							labelId: labelId,
							taskId: task.id,
						},
					},
				}),
			),
		);

		try {
			await Promise.all(labelsToAddPromises);
			await Promise.all(labelsToRemovePromises);

			const updatedTask = await prisma.task.update({
				where: { id: updateTaskDto.id },
				data,
				include: {
					labels: {
						select: {
							label: {
								select: {
									id: true,
									name: true,
									color: true,
								},
							},
						},
					},
				},
			});

			return TaskEntity.fromObject(updatedTask!);
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}

	async deleteTask(getTaskDto: GetTaskDto) {
		await this.findById(getTaskDto.id, getTaskDto.userId);

		try {
			await prisma.labelsOnTask.deleteMany({
				where: { taskId: getTaskDto.id },
			});

			const deletedTask = await prisma.task.delete({
				where: { id: getTaskDto.id },
				include: {
					labels: {
						select: {
							label: {
								select: {
									id: true,
									name: true,
									color: true,
								},
							},
						},
					},
				},
			});

			return TaskEntity.fromObject(deletedTask);
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}
}
