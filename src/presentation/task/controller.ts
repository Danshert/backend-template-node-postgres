import { Request, Response } from 'express';

import { TaskService } from '../services';

import {
	CreateTaskDto,
	UpdateTaskDto,
	GetTaskDto,
	GetTasksDto,
} from '../../domain/dtos/';

import { CustomError } from '../../domain/errors';
import { PaginationDto } from '../../domain/dtos/shared';

export class TaskController {
	// eslint-disable-next-line no-unused-vars
	constructor(private readonly taskService: TaskService) {}

	private handleError = (error: unknown, response: Response) => {
		if (error instanceof CustomError) {
			return response
				.status(error.statusCode)
				.json({ error: error.message });
		}

		console.log(`${error}`);
		return response.status(500).json({ error: 'Internal server error' });
	};

	getTasks = async (request: Request, response: Response) => {
		const [error, getTasksDto] = GetTasksDto.create({
			...request.query,
			...request.body,
			userId: request.body.user.id,
		});

		const [errorPagination, paginationDto] = PaginationDto.create({
			...request.query,
			...request.body,
		});

		if (error || errorPagination) {
			return response.status(400).json({ error });
		}

		this.taskService
			.getTasks(getTasksDto!, paginationDto!)
			.then((tasks) => response.status(200).json(tasks))
			.catch((error) => this.handleError(error, response));
	};

	getTaskById = (request: Request, response: Response) => {
		const id = request.params.id;

		const [error, getTaskDto] = GetTaskDto.create({
			id,
			userId: request.body.user.id,
		});

		if (error) return response.status(400).json({ error });

		this.taskService
			.getTaskById(getTaskDto!)
			.then((task) => response.status(200).json(task))
			.catch((error) => this.handleError(error, response));
	};

	createTask = (request: Request, response: Response) => {
		const [error, createTaskDto] = CreateTaskDto.create({
			...request.query,
			...request.body,
			userId: request.body.user.id,
		});

		if (error) return response.status(400).json({ error });

		this.taskService
			.createTask(createTaskDto!)
			.then((task) => response.status(201).json(task))
			.catch((error) => this.handleError(error, response));
	};

	updateTask = (request: Request, response: Response) => {
		const id = request.params.id;

		const [error, updateTaskDto] = UpdateTaskDto.create({
			...request.query,
			...request.body,
			userId: request.body.user.id,
			id,
		});

		if (error) return response.status(400).json({ error });

		this.taskService
			.updateTask(updateTaskDto!)
			.then((task) => response.status(200).json(task))
			.catch((error) => this.handleError(error, response));
	};

	deleteTask = (request: Request, response: Response) => {
		const id = request.params.id;

		const [error, getTaskDto] = GetTaskDto.create({
			userId: request.body.user.id,
			id,
		});

		if (error) return response.status(400).json({ error });

		this.taskService
			.deleteTask(getTaskDto!)
			.then((task) => response.status(200).json(task))
			.catch((error) => this.handleError(error, response));
	};
}
