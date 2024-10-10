import { createServer } from 'http';

import { v4 as uuidv4 } from 'uuid';
import { toBeOneOf } from 'jest-extended';

import { envs } from '../../../src/config';

import { prisma } from '../../../src/data/postgres';

import { AppRoutes } from '../../../src/presentation/routes';
import { LabelEntity } from '../../../src/domain';

import {
	AuthService,
	BoardService,
	EmailService,
	LabelService,
	WssService,
} from '../../../src/presentation/services';

import {
	CreateBoardDto,
	CreateLabelDto,
	GetLabelDto,
	GetLabelsDto,
	RegisterUserDto,
	UpdateLabelDto,
} from '../../../src/domain/dtos';

import { testServer } from '../../test-server';

expect.extend({ toBeOneOf });

describe('Tests in label service', () => {
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

	test('should get labels', async () => {
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

		const labelService = new LabelService();

		const [, getLabelsDto] = GetLabelsDto.create({
			userId: user.id,
			boardId,
		});

		const labels = await labelService.getLabels(getLabelsDto!);

		expect(labels).toBeInstanceOf(Array);

		await prisma.board.delete({ where: { id: boardId } });
		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should get a label', async () => {
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

		const labelService = new LabelService();

		const [, createLabelDto] = CreateLabelDto.create({
			name: 'Label',
			userId: user.id,
			boardId,
		});

		const { id: labelId, name } = await labelService.createLabel(
			createLabelDto!,
		);

		const label = await labelService.findById(labelId, user.id);

		expect(label).toEqual(
			expect.objectContaining({
				id: labelId,
				userId: user.id,
				boardId,
				name,
			}),
		);

		await prisma.label.delete({ where: { id: label.id } });
		await prisma.board.delete({ where: { id: boardId } });
		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should return error message: not found in get a label', async () => {
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

		const labelService = new LabelService();

		const [, createLabelDto] = CreateLabelDto.create({
			name: 'Label',
			userId: user.id,
			boardId,
		});

		const label = await labelService.createLabel(createLabelDto!);

		try {
			await labelService.findById('ABC', user.id);
		} catch (error) {
			expect(`${error}`).toContain('not found');
		}

		await prisma.label.delete({ where: { id: label.id } });
		await prisma.board.delete({ where: { id: boardId } });
		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should return error message: You cannot access in get a label', async () => {
		const userData = {
			name: 'User',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const userData2 = {
			name: 'User 2',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);
		const [, registerUserDto2] = RegisterUserDto.create(userData2);

		const authService = new AuthService(emailService);

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

		const labelService = new LabelService();

		const [, createLabelDto] = CreateLabelDto.create({
			name: 'Label',
			userId: user1.id,
			boardId,
		});

		const { id: labelId } = await labelService.createLabel(createLabelDto!);

		try {
			await labelService.findById(
				labelId.toString(),
				user2.id.toString(),
			);
		} catch (error) {
			expect(`${error}`).toContain('You cannot access');
		}

		await prisma.label.delete({ where: { id: labelId } });
		await prisma.board.delete({ where: { id: boardId } });
		await prisma.user.delete({ where: { id: user1.id } });
		await prisma.user.delete({ where: { id: user2.id } });
	});

	test('should create a label', async () => {
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

		const labelService = new LabelService();

		const [, createLabelDto] = CreateLabelDto.create({
			name: 'Label',
			userId: user.id,
			boardId,
		});

		const label = await labelService.createLabel(createLabelDto!);

		expect(label).toBeInstanceOf(LabelEntity);

		await prisma.label.delete({ where: { id: label.id } });
		await prisma.board.delete({ where: { id: boardId } });
		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should update a label', async () => {
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

		const labelService = new LabelService();

		const [, createLabelDto] = CreateLabelDto.create({
			name: 'Label',
			userId: user.id,
			boardId,
		});

		const label = await labelService.createLabel(createLabelDto!);

		const updateLabelData = { name: 'Label updated' };

		const [, updateLabelDto] = UpdateLabelDto.create({
			userId: user.id,
			id: label.id,
			...updateLabelData,
		});

		const updatedLabel = await labelService.updateLabel(updateLabelDto!);

		expect(updatedLabel).toEqual(
			expect.objectContaining({ ...updateLabelData }),
		);

		await prisma.label.delete({ where: { id: label.id } });
		await prisma.board.delete({ where: { id: boardId } });
		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should delete a label', async () => {
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

		const labelService = new LabelService();

		const [, createLabelDto] = CreateLabelDto.create({
			name: 'Label',
			userId: user.id,
			boardId,
		});

		const label = await labelService.createLabel(createLabelDto!);

		const [, getLabelDto] = GetLabelDto.create({
			userId: user.id,
			id: label.id,
		});

		const deletedLabel = await labelService.deleteLabel(getLabelDto!);

		expect(deletedLabel).toEqual(label);

		await prisma.board.delete({ where: { id: boardId } });
		await prisma.user.delete({ where: { id: user.id } });
	});
});
