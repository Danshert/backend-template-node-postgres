import { createServer } from 'http';

import { v4 as uuidv4 } from 'uuid';
import { toBeOneOf } from 'jest-extended';

import { prisma } from '../../../src/data/postgres';

import { envs } from '../../../src/config';

import { BoardEntity } from '../../../src/domain';

import { AppRoutes } from '../../../src/presentation/routes';

import {
	AuthService,
	BoardService,
	EmailService,
	WssService,
} from '../../../src/presentation/services';

import {
	CreateBoardDto,
	GetBoardDto,
	GetBoardsDto,
	PaginationDto,
	RegisterUserDto,
	UpdateBoardDto,
} from '../../../src/domain/dtos';

import { testServer } from '../../test-server';

expect.extend({ toBeOneOf });

describe('Tests in board service', () => {
	const emailService = new EmailService(
		envs.MAILER_SERVICE,
		envs.MAILER_EMAIL,
		envs.MAILER_SECRET_KEY,
		envs.SEND_EMAIL,
	);

	beforeAll(async () => {
		const httpServer = createServer(testServer.app);
		WssService.initWss({ server: httpServer });

		testServer.setRoutes(AppRoutes.routes);

		await testServer.start();
	});

	afterAll(async () => {
		testServer.close();
	});

	test('should get boards', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const authService = new AuthService(emailService);

		const { user } = await authService.registerUser(registerUserDto!);

		const [, getBoardsDto] = GetBoardsDto.create({ userId: user.id });
		const [, paginationDto] = PaginationDto.create({});

		const boardService = new BoardService();

		const resp = await boardService.getBoards(
			getBoardsDto!,
			paginationDto!,
		);

		expect(resp).toEqual({
			boards: expect.any(Array),
			lastPage: expect.any(Number),
			limit: expect.any(Number),
			next: expect.toBeOneOf([expect.any(String), null]),
			page: expect.any(Number),
			prev: expect.toBeOneOf([expect.any(String), null]),
			total: expect.any(Number),
		});

		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should get board by id', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const authService = new AuthService(emailService);

		const { user } = await authService.registerUser(registerUserDto!);

		const boardData = { name: 'Test' };

		const [, createBoardDto] = CreateBoardDto.create({
			name: boardData.name,
			userId: user.id,
		});

		const boardService = new BoardService();

		const { id: boardId } = await boardService.createBoard(createBoardDto!);

		const [, getBoardDto] = GetBoardDto.create({
			id: boardId,
			userId: user.id,
		});

		const board = await boardService.getBoardById(getBoardDto!);

		expect(board).toBeInstanceOf(BoardEntity);

		await prisma.board.delete({ where: { id: boardId } });
		await prisma.user.delete({ where: { id: user.id } });
	});

	test(`should return error message: not found in get board by id`, async () => {
		const userData = {
			name: 'User',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const authService = new AuthService(emailService);

		const { user } = await authService.registerUser(registerUserDto!);

		const boardData = { name: 'Test' };

		const [, createBoardDto] = CreateBoardDto.create({
			name: boardData.name,
			userId: user.id,
		});

		const boardService = new BoardService();

		const board = await boardService.createBoard(createBoardDto!);

		const [, getBoardDto] = GetBoardDto.create({
			id: 'ABC',
			userId: user.id,
		});

		try {
			await boardService.getBoardById(getBoardDto!);
		} catch (error) {
			expect(`${error}`).toContain('not found');
		}

		await prisma.board.delete({ where: { id: board.id } });
		await prisma.user.delete({ where: { id: user.id } });
	});

	test(`should return error message: You cannot access in get board by id`, async () => {
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

		const [, registerUserDto] = RegisterUserDto.create(userData1);
		const [, registerUserDto2] = RegisterUserDto.create(userData2);

		const authService = new AuthService(emailService);

		const { user: user1 } = await authService.registerUser(
			registerUserDto!,
		);
		const { user: user2 } = await authService.registerUser(
			registerUserDto2!,
		);

		const boardData = { name: 'Test' };

		const boardService = new BoardService();

		const [, createBoardDto] = CreateBoardDto.create({
			name: boardData.name,
			userId: user1.id,
		});

		const { id: boardId } = await boardService.createBoard(createBoardDto!);

		const [, getBoardDto] = GetBoardDto.create({
			id: boardId,
			userId: user2.id,
		});

		try {
			await boardService.getBoardById(getBoardDto!);
		} catch (error) {
			console.log(error);
			expect(`${error}`).toContain('You cannot access');
		}

		await prisma.board.delete({ where: { id: boardId } });
		await prisma.user.delete({ where: { id: user1.id } });
		await prisma.user.delete({ where: { id: user2.id } });
	});

	test('should create a board', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const authService = new AuthService(emailService);

		const { user } = await authService.registerUser(registerUserDto!);

		const boardData = { name: 'Test' };

		const [, createBoardDto] = CreateBoardDto.create({
			name: boardData.name,
			userId: user.id,
		});

		const boardService = new BoardService();

		const board = await boardService.createBoard(createBoardDto!);

		expect(board).toBeInstanceOf(BoardEntity);

		await prisma.board.delete({ where: { id: board.id } });
		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should update a board', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const authService = new AuthService(emailService);

		const { user } = await authService.registerUser(registerUserDto!);

		const boardData = { name: 'Board' };

		const [, createBoardDto] = CreateBoardDto.create({
			name: boardData.name,
			userId: user.id,
		});

		const boardService = new BoardService();

		const board = await boardService.createBoard(createBoardDto!);

		const boardUpdateData = { name: 'Board updated' };

		const [, updateBoardDto] = UpdateBoardDto.create({
			id: board.id,
			userId: user.id,
			...boardUpdateData,
		});

		const updatedBoard = await boardService.updateBoard(updateBoardDto!);

		expect(updatedBoard).toEqual(
			expect.objectContaining({
				...boardUpdateData,
			}),
		);

		await prisma.board.delete({ where: { id: board.id } });
		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should delete a board', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const authService = new AuthService(emailService);

		const { user } = await authService.registerUser(registerUserDto!);

		const boardData = { name: 'Test' };

		const [, createBoardDto] = CreateBoardDto.create({
			name: boardData.name,
			userId: user.id,
		});

		const boardService = new BoardService();

		const { id: boardId } = await boardService.createBoard(createBoardDto!);

		const [, getBoardDto] = GetBoardDto.create({
			id: boardId,
			userId: user.id,
		});

		const board = await boardService.deleteBoard(getBoardDto!);

		expect(board).toBeInstanceOf(BoardEntity);

		await prisma.user.delete({ where: { id: user.id } });
	});
});
