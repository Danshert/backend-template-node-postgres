import { createServer } from 'http';

import { v4 as uuidv4 } from 'uuid';
import { toBeOneOf } from 'jest-extended';

import { envs } from '../../../src/config';

import { prisma } from '../../../src/data/postgres';

import { TaskEntity } from '../../../src/domain';

import { AppRoutes } from '../../../src/presentation/routes';

import {
	AuthService,
	BoardService,
	EmailService,
	TaskService,
	WssService,
} from '../../../src/presentation/services';

import {
	CreateBoardDto,
	CreateTaskDto,
	GetTaskDto,
	GetTasksDto,
	PaginationDto,
	RegisterUserDto,
	UpdateTaskDto,
} from '../../../src/domain/dtos';

import { testServer } from '../../test-server';

expect.extend({ toBeOneOf });

describe('Tests in task service', () => {
	const emailService = new EmailService(
		envs.MAILER_SERVICE,
		envs.MAILER_EMAIL,
		envs.MAILER_SECRET_KEY,
		envs.SEND_EMAIL,
	);

	beforeEach(async () => {
		const httpServer = createServer(testServer.app);
		WssService.initWss({ server: httpServer });

		testServer.setRoutes(AppRoutes.routes);

		await testServer.start();
	});

	afterEach(async () => {
		testServer.close();
	});

	test('should get tasks', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const authService = new AuthService(emailService);

		const { user } = await authService.registerUser(registerUserDto!);

		const [, createBoardDto] = CreateBoardDto.create({
			name: 'Board',
			userId: user.id,
		});

		const boardService = new BoardService();

		const { id: boardId } = await boardService.createBoard(createBoardDto!);

		const [, paginationDto] = PaginationDto.create({});

		const [, getTasksDto] = GetTasksDto.create({
			userId: user.id,
			boardId,
		});

		const taskService = new TaskService();

		const resp = await taskService.getTasks(getTasksDto!, paginationDto!);

		expect(resp).toEqual({
			tasks: expect.any(Array),
			lastPage: expect.any(Number),
			limit: expect.any(Number),
			next: expect.toBeOneOf([expect.any(String), null]),
			page: expect.any(Number),
			prev: expect.toBeOneOf([expect.any(String), null]),
			total: expect.any(Number),
		});

		await prisma.board.delete({ where: { id: boardId } });
		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should get a task', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const authService = new AuthService(emailService);

		const { user } = await authService.registerUser(registerUserDto!);

		const [, createBoardDto] = CreateBoardDto.create({
			name: 'Board',
			userId: user.id,
		});

		const boardService = new BoardService();

		const { id: boardId } = await boardService.createBoard(createBoardDto!);

		const taskService = new TaskService();

		const [, createTaskDto] = CreateTaskDto.create({
			title: 'Task',
			userId: user.id,
			boardId,
		});

		const { id: taskId } = await taskService.createTask(createTaskDto!);

		const [, getTaskDto] = GetTaskDto.create({
			id: taskId,
			userId: user.id,
		});

		const task = await taskService.getTaskById(getTaskDto!);

		expect(task).toBeInstanceOf(TaskEntity);

		await prisma.task.delete({ where: { id: task.id } });
		await prisma.board.delete({ where: { id: boardId } });
		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should return error message: not found in get a task', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const authService = new AuthService(emailService);

		const { user } = await authService.registerUser(registerUserDto!);

		const [, createBoardDto] = CreateBoardDto.create({
			name: 'Board',
			userId: user.id,
		});

		const boardService = new BoardService();

		const { id: boardId } = await boardService.createBoard(createBoardDto!);

		const taskService = new TaskService();

		const [, createTaskDto] = CreateTaskDto.create({
			title: 'Task',
			userId: user.id,
			boardId,
		});

		const task = await taskService.createTask(createTaskDto!);

		const [, getTaskDto] = GetTaskDto.create({
			id: 'ABC',
			userId: user.id,
		});

		try {
			await taskService.getTaskById(getTaskDto!);
		} catch (error) {
			expect(`${error}`).toContain('not found');
		}

		await prisma.task.delete({ where: { id: task.id } });
		await prisma.board.delete({ where: { id: boardId } });
		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should return error message: You cannot access in get a task', async () => {
		const userData1 = {
			name: 'User',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const userData2 = {
			name: 'User 2',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData1);
		const [, registerUserDto2] = RegisterUserDto.create(userData2);

		const { user: user1 } = await authService.registerUser(
			registerUserDto!,
		);
		const { user: user2 } = await authService.registerUser(
			registerUserDto2!,
		);

		const [, createBoardDto] = CreateBoardDto.create({
			name: 'Board',
			userId: user1.id,
		});

		const boardService = new BoardService();

		const { id: boardId } = await boardService.createBoard(createBoardDto!);

		const taskService = new TaskService();

		const [, createTaskDto] = CreateTaskDto.create({
			title: 'Task',
			userId: user1.id,
			boardId,
		});

		const { id: taskId } = await taskService.createTask(createTaskDto!);

		const [, getTaskDto] = GetTaskDto.create({
			id: taskId,
			userId: user2.id,
		});

		try {
			await taskService.getTaskById(getTaskDto!);
		} catch (error) {
			expect(`${error}`).toContain('You cannot access');
		}

		await prisma.task.delete({ where: { id: taskId } });
		await prisma.board.delete({ where: { id: boardId } });
		await prisma.user.delete({ where: { id: user1.id } });
		await prisma.user.delete({ where: { id: user2.id } });
	});

	test('should create a task', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const authService = new AuthService(emailService);

		const { user } = await authService.registerUser(registerUserDto!);

		const [, createBoardDto] = CreateBoardDto.create({
			name: 'Board',
			userId: user.id,
		});

		const boardService = new BoardService();

		const { id: boardId } = await boardService.createBoard(createBoardDto!);

		const taskService = new TaskService();

		const [, createTaskDto] = CreateTaskDto.create({
			title: 'Task',
			userId: user.id,
			boardId,
		});

		const task = await taskService.createTask(createTaskDto!);

		expect(task).toBeInstanceOf(TaskEntity);

		await prisma.task.delete({ where: { id: task.id } });
		await prisma.board.delete({ where: { id: boardId } });
		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should update a task', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const authService = new AuthService(emailService);

		const { user } = await authService.registerUser(registerUserDto!);

		const [, createBoardDto] = CreateBoardDto.create({
			name: 'Board',
			userId: user.id,
		});

		const boardService = new BoardService();

		const { id: boardId } = await boardService.createBoard(createBoardDto!);

		const taskService = new TaskService();

		const [, createTaskDto] = CreateTaskDto.create({
			title: 'Task',
			userId: user.id,
			boardId,
		});

		const task = await taskService.createTask(createTaskDto!);

		const updateTaskData = { title: 'Task updated' };

		const [, updateTaskDto] = UpdateTaskDto.create({
			id: task.id,
			userId: user.id,
			...updateTaskData,
		});

		const updatedTask = await taskService.updateTask(updateTaskDto!);

		expect(updatedTask).toEqual(
			expect.objectContaining({ ...updateTaskData }),
		);

		await prisma.task.delete({ where: { id: task.id } });
		await prisma.board.delete({ where: { id: boardId } });
		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should delete a task', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const authService = new AuthService(emailService);

		const { user } = await authService.registerUser(registerUserDto!);

		const [, createBoardDto] = CreateBoardDto.create({
			name: 'Board',
			userId: user.id,
		});

		const boardService = new BoardService();

		const { id: boardId } = await boardService.createBoard(createBoardDto!);

		const taskService = new TaskService();

		const [, createTaskDto] = CreateTaskDto.create({
			title: 'Task',
			userId: user.id,
			boardId,
		});

		const task = await taskService.createTask(createTaskDto!);

		const [, getTaskDto] = GetTaskDto.create({
			id: task.id,
			userId: user.id,
		});

		const deletedTask = await taskService.deleteTask(getTaskDto!);

		expect(deletedTask).toEqual(task);

		await prisma.board.delete({ where: { id: boardId } });
		await prisma.user.delete({ where: { id: user.id } });
	});
});
