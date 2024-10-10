import { createServer } from 'http';

import { toBeOneOf } from 'jest-extended';
import { v4 as uuidv4 } from 'uuid';

import { envs } from '../../../src/config';

import { AppRoutes } from '../../../src/presentation/routes';

import {
	AuthService,
	BoardService,
	EmailService,
	NotificationService,
	TaskService,
	WssService,
} from '../../../src/presentation/services';

import {
	CreateBoardDto,
	CreateTaskDto,
	GetNotificationsDto,
	PaginationDto,
	RegisterUserDto,
} from '../../../src/domain/dtos';

import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';

expect.extend({ toBeOneOf });

describe('Tests in notification service', () => {
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

	test('should make subscription', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const authService = new AuthService(emailService);

		const { user } = await authService.registerUser(registerUserDto!);

		const subscription = {
			endpoint: 'test',
			expirationTime: null,
			keys: {
				auth: 'ABC',
				p256dh: 'ABC',
			},
		};

		const notificationService = new NotificationService(emailService);

		const resp = await notificationService.subscription(
			user.id.toString(),
			subscription,
		);

		expect(resp).toEqual({
			ok: true,
			message: 'Subscribed!',
		});

		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should return message: Client already subscribed in subscription', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const authService = new AuthService(emailService);

		const { user } = await authService.registerUser(registerUserDto!);

		const subscription = {
			endpoint: 'test',
			expirationTime: null,
			keys: {
				auth: 'ABC',
				p256dh: 'ABC',
			},
		};

		const notificationService = new NotificationService(emailService);

		await notificationService.subscription(
			user.id.toString(),
			subscription,
		);

		const resp = await notificationService.subscription(
			user.id.toString(),
			subscription,
		);

		expect(resp).toEqual({
			ok: true,
			message: 'Client already subscribed',
		});

		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should check user not subscribed', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const authService = new AuthService(emailService);

		const { user } = await authService.registerUser(registerUserDto!);

		const subscription = {
			endpoint: 'test',
			expirationTime: null,
			keys: {
				auth: 'ABC',
				p256dh: 'ABC',
			},
		};

		const notificationService = new NotificationService(emailService);

		const resp = await notificationService.checkSubscription(
			user.id.toString(),
			subscription,
		);

		expect(resp).toEqual({
			ok: true,
			message: 'Not subscribed',
		});

		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should check user already subscribed', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const authService = new AuthService(emailService);

		const { user } = await authService.registerUser(registerUserDto!);

		const subscription = {
			endpoint: 'test',
			expirationTime: null,
			keys: {
				auth: 'ABC',
				p256dh: 'ABC',
			},
		};

		const notificationService = new NotificationService(emailService);

		await notificationService.subscription(
			user.id.toString(),
			subscription,
		);

		const resp = await notificationService.checkSubscription(
			user.id.toString(),
			subscription,
		);

		expect(resp).toEqual({
			ok: true,
			message: 'Client already subscribed',
		});

		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should get notifications', async () => {
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

		const notificationService = new NotificationService(emailService);

		const [, getNotificationsDto] = GetNotificationsDto.create({
			userId: user.id,
			boardId,
		});

		const resp = await notificationService.getNotifications(
			getNotificationsDto!,
			paginationDto!,
		);

		expect(resp).toEqual({
			notifications: expect.any(Array),
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

	test('should mark notification as seen', async () => {
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

		const board = await boardService.createBoard(createBoardDto!);

		const taskService = new TaskService();

		const [, createTaskDto] = CreateTaskDto.create({
			title: 'Task',
			userId: user.id,
			boardId: board.id,
		});

		const task = await taskService.createTask(createTaskDto!);

		const notification = await prisma.notification.create({
			data: {
				userId: user.id,
				boardId: board.id,
				taskId: task.id,
				message: 'Test',
			},
		});

		const notificationService = new NotificationService(emailService);

		const notificationSeen =
			await notificationService.markNotificationAsSeen(
				notification.id.toString(),
				user.id.toString(),
			);

		expect(notificationSeen.seen).toBe(true);

		await prisma.task.delete({ where: { id: task.id } });
		await prisma.board.delete({ where: { id: board.id } });
		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should find notification by id', async () => {
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

		const board = await boardService.createBoard(createBoardDto!);

		const taskService = new TaskService();

		const [, createTaskDto] = CreateTaskDto.create({
			title: 'Task',
			userId: user.id,
			boardId: board.id,
		});

		const task = await taskService.createTask(createTaskDto!);

		const notification = await prisma.notification.create({
			data: {
				userId: user.id,
				boardId: board.id,
				taskId: task.id,
				message: 'Test',
			},
		});

		const notificationService = new NotificationService(emailService);

		const resp = await notificationService.findById(
			notification.id.toString(),
			user.id.toString(),
		);

		expect(resp).toEqual(
			expect.objectContaining({
				id: expect.any(String),
				userId: user.id,
				boardId: board.id,
				taskId: task.id,
				message: 'Test',
			}),
		);

		await prisma.task.delete({ where: { id: task.id } });
		await prisma.board.delete({ where: { id: board.id } });
		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should return error message: not found id find notification by id', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const authService = new AuthService(emailService);

		const { user } = await authService.registerUser(registerUserDto!);

		const notificationService = new NotificationService(emailService);

		try {
			await notificationService.findById('ABC', user.id.toString());
		} catch (error) {
			expect(`${error}`).toContain('not found');
		}

		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should checkDueDatesOfTasks has been called', async () => {
		const notificationService = new NotificationService(emailService);
		const logSpy = jest.spyOn(notificationService, 'checkDueDatesOfTasks');

		await notificationService.checkDueDatesOfTasks();

		expect(logSpy).toHaveBeenCalled();
	});
});
