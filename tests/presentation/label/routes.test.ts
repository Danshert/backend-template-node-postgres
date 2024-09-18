import request from 'supertest';

import { v4 as uuidv4 } from 'uuid';

import { prisma } from '../../../src/data/postgres';

import { testServer } from '../../test-server';

describe('Tests in label routes', () => {
	beforeEach(async () => {
		await testServer.start();
	});

	afterEach(async () => {
		await prisma.label.deleteMany();
		await prisma.board.deleteMany();
		await prisma.user.deleteMany();

		testServer.close();
	});

	test('should get labels - /api/labels', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
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

		const boardData = { name: 'Test' };

		const { body: board } = await request(testServer.app)
			.post('/api/boards')
			.send(boardData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		const { body } = await request(testServer.app)
			.get(`/api/labels/${board.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(body).toBeInstanceOf(Array);
	});

	test('should create label - /api/labels', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
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

		const boardData = { name: 'Test' };

		const { body: board } = await request(testServer.app)
			.post('/api/boards')
			.send(boardData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		const labelData = { boardId: board.id, name: 'Label' };

		const { body: label } = await request(testServer.app)
			.post('/api/labels')
			.send(labelData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		expect(label).toEqual({
			id: expect.any(String),
			name: expect.any(String),
			color: null,
		});
	});

	test('should update label - /api/labels', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
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

		const boardData = { name: 'Test' };

		const { body: board } = await request(testServer.app)
			.post('/api/boards')
			.send(boardData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		const labelData = { boardId: board.id, name: 'Label' };

		const { body: label } = await request(testServer.app)
			.post('/api/labels')
			.send(labelData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		const updatedData = { name: 'Updated label' };

		const { body: updatedLabel } = await request(testServer.app)
			.put(`/api/labels/${label.id}`)
			.send(updatedData)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(updatedLabel).toEqual({
			id: label.id,
			name: updatedData.name,
			color: null,
		});
	});

	test('should delete label - /api/labels', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
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

		const boardData = { name: 'Test' };

		const { body: board } = await request(testServer.app)
			.post('/api/boards')
			.send(boardData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		const labelData = { boardId: board.id, name: 'Label' };

		const { body: label } = await request(testServer.app)
			.post('/api/labels')
			.send(labelData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		const { body: deletedLabel } = await request(testServer.app)
			.delete(`/api/labels/${label.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(deletedLabel).toEqual(label);
	});
});
