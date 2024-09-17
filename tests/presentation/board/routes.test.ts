import request from 'supertest';
import { toBeOneOf } from 'jest-extended';

import { prisma } from '../../../src/data/postgres';

import { testServer } from '../../test-server';

expect.extend({ toBeOneOf });

describe('Tests in board routes', () => {
	beforeAll(async () => {
		await testServer.start();
	});

	afterAll(async () => {
		await prisma.board.deleteMany();
		await prisma.user.deleteMany();

		testServer.close();
	});

	test('should get boards - /api/boards', async () => {
		const userData = {
			name: 'Test',
			email: `${Date.now()}@test.com`,
			password: '123456',
		};

		const {
			body: { user, token },
		} = await request(testServer.app)
			.post('/api/auth/register')
			.send(userData)
			.expect(200);

		await prisma.user.update({
			where: { id: user.id },
			data: { emailValidated: true },
		});

		const { body } = await request(testServer.app)
			.get('/api/boards')
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		expect(body).toEqual({
			boards: expect.any(Array),
			lastPage: expect.any(Number),
			limit: expect.any(Number),
			next: expect.toBeOneOf([expect.any(String), null]),
			page: expect.any(Number),
			prev: expect.toBeOneOf([expect.any(String), null]),
			total: expect.any(Number),
		});
	});

	test('should get board - /api/boards/id', async () => {
		const userData = {
			name: 'Test',
			email: `${Date.now()}@test.com`,
			password: '123456',
		};

		const {
			body: { user, token },
		} = await request(testServer.app)
			.post('/api/auth/register')
			.send(userData)
			.expect(200);

		await prisma.user.update({
			where: { email: user.email },
			data: { emailValidated: true },
		});

		const boardData = { name: 'Board' };

		const { body: board } = await request(testServer.app)
			.post('/api/boards')
			.send(boardData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		const { body } = await request(testServer.app)
			.get(`/api/boards/${board.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(body).toEqual({
			id: expect.any(String),
			name: boardData.name,
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
			isActive: expect.any(Boolean),
		});
	});

	test('should create board - /api/boards', async () => {
		const userData = {
			name: 'Test',
			email: `${Date.now()}@test.com`,
			password: '123456',
		};

		const {
			body: { user, token },
		} = await request(testServer.app)
			.post('/api/auth/register')
			.send(userData)
			.expect(200);

		await prisma.user.update({
			where: { email: user.email },
			data: { emailValidated: true },
		});

		const boardData = { name: 'Test' };

		const { body: board } = await request(testServer.app)
			.post('/api/boards')
			.send(boardData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		expect(board).toEqual({
			id: expect.any(String),
			name: boardData.name,
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
			isActive: true,
		});
	});

	test('should update board - /api/boards', async () => {
		const userData = {
			name: 'Test',
			email: `${Date.now()}@test.com`,
			password: '123456',
		};

		const {
			body: { user, token },
		} = await request(testServer.app)
			.post('/api/auth/register')
			.send(userData)
			.expect(200);

		await prisma.user.update({
			where: { email: user.email },
			data: { emailValidated: true },
		});

		const boardData = { name: 'Test' };

		const { body: board } = await request(testServer.app)
			.post('/api/boards')
			.send(boardData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		const updatedData = { name: 'Updated board' };

		const { body: updatedBoard } = await request(testServer.app)
			.put(`/api/boards/${board.id}`)
			.send(updatedData)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(updatedBoard).toEqual({
			id: expect.any(String),
			name: updatedData.name,
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
			isActive: true,
		});
	});

	test('should delete board - /api/boards', async () => {
		const userData = {
			name: 'Test',
			email: `${Date.now()}@test.com`,
			password: '123456',
		};

		const {
			body: { user, token },
		} = await request(testServer.app)
			.post('/api/auth/register')
			.send(userData)
			.expect(200);

		await prisma.user.update({
			where: { email: user.email },
			data: { emailValidated: true },
		});

		const boardData = { name: 'Test' };

		const { body: board } = await request(testServer.app)
			.post('/api/boards')
			.send(boardData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		const { body } = await request(testServer.app)
			.delete(`/api/boards/${board.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(body).toEqual({
			id: expect.any(String),
			name: boardData.name,
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
			isActive: expect.any(Boolean),
		});
	});
});
