import request from 'supertest';

import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';

import { prisma } from '../../../src/data/postgres';

import { testServer } from '../../test-server';
import { WssService } from '../../../src/presentation/services';
import { AppRoutes } from '../../../src/presentation/routes';

describe('Tests in label routes', () => {
	beforeEach(async () => {
		const httpServer = createServer(testServer.app);
		WssService.initWss({ server: httpServer });

		testServer.setRoutes(AppRoutes.routes);

		await testServer.start();
	});

	afterEach(async () => {
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
			.expect(201);

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

		await prisma.board.delete({ where: { id: board.id } });
		await prisma.user.delete({ where: { id: user.id } });
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
			.expect(201);

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

		await prisma.label.delete({ where: { id: label.id } });
		await prisma.board.delete({ where: { id: board.id } });
		await prisma.user.delete({ where: { id: user.id } });
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
			.expect(201);

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

		await prisma.label.delete({ where: { id: label.id } });
		await prisma.board.delete({ where: { id: board.id } });
		await prisma.user.delete({ where: { id: user.id } });
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
			.expect(201);

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

		await prisma.board.delete({ where: { id: board.id } });
		await prisma.user.delete({ where: { id: user.id } });
	});
});
