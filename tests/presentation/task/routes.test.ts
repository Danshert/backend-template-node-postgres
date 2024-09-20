import request from 'supertest';
import { toBeOneOf } from 'jest-extended';

import { v4 as uuidv4 } from 'uuid';

import { prisma } from '../../../src/data/postgres';

import { testServer } from '../../test-server';
import { TaskStatus } from '@prisma/client';

expect.extend({ toBeOneOf });

describe('Tests in label routes', () => {
	beforeAll(async () => {
		await testServer.start();
	});

	afterAll(async () => {
		await prisma.labelsOnTask.deleteMany();
		await prisma.task.deleteMany();
		await prisma.label.deleteMany();
		await prisma.board.deleteMany();
		await prisma.user.deleteMany();

		testServer.close();
	});

	test('should get tasks - /api/tasks', async () => {
		const userData = {
			name: 'User',
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

		const boardData = { name: 'Board' };

		const { body: board } = await request(testServer.app)
			.post('/api/boards')
			.send(boardData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		const { body } = await request(testServer.app)
			.get('/api/tasks')
			.send({ boardId: board.id })
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(body).toEqual({
			tasks: expect.any(Array),
			lastPage: expect.any(Number),
			limit: expect.any(Number),
			next: expect.toBeOneOf([expect.any(String), null]),
			page: expect.any(Number),
			prev: expect.toBeOneOf([expect.any(String), null]),
			total: expect.any(Number),
		});
	});

	test('should get task - /api/tasks', async () => {
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

		const boardData = { name: 'Board' };

		const { body: board } = await request(testServer.app)
			.post('/api/boards')
			.send(boardData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		const taskData = { boardId: board.id, title: 'Task' };

		const { body: task } = await request(testServer.app)
			.post('/api/tasks')
			.send(taskData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		const { body } = await request(testServer.app)
			.get(`/api/tasks/${task.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(body).toEqual({ ...task, labels: [] });
	});

	test('should create task - /api/tasks', async () => {
		const userData = {
			name: 'User',
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

		const boardData = { name: 'Board' };

		const { body: board } = await request(testServer.app)
			.post('/api/boards')
			.send(boardData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		const taskData = { boardId: board.id, title: 'Task' };

		const { body: task } = await request(testServer.app)
			.post('/api/tasks')
			.send(taskData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		expect(task).toEqual({
			id: expect.any(String),
			title: taskData.title,
			description: '',
			endDate: expect.toBeOneOf([expect.any(String), null]),
			status: TaskStatus.TODO,
			reminder: false,
			startDate: expect.toBeOneOf([expect.any(String), null]),
			labels: [],
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
			isActive: true,
		});
	});

	test('should update task - /api/tasks', async () => {
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

		const boardData = { name: 'Board' };

		const { body: board } = await request(testServer.app)
			.post('/api/boards')
			.send(boardData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		const taskData = { boardId: board.id, title: 'Task' };

		const { body: task } = await request(testServer.app)
			.post('/api/tasks')
			.send(taskData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		const updatedData = { title: 'Updated task' };

		const { body: updatedTask } = await request(testServer.app)
			.put(`/api/tasks/${task.id}`)
			.send(updatedData)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(updatedTask).toEqual({
			id: task.id,
			title: updatedData.title,
			description: task.description,
			endDate: expect.toBeOneOf([expect.any(String), null]),
			status: task.status,
			reminder: task.reminder,
			startDate: expect.toBeOneOf([expect.any(String), null]),
			labels: [],
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
			isActive: true,
		});
	});

	test('should delete task - /api/tasks', async () => {
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

		const boardData = { name: 'Board' };

		const { body: board } = await request(testServer.app)
			.post('/api/boards')
			.send(boardData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		const taskData = { boardId: board.id, title: 'Task' };

		const { body: task } = await request(testServer.app)
			.post('/api/tasks')
			.send(taskData)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);

		const { body: deletedTask } = await request(testServer.app)
			.delete(`/api/tasks/${task.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(deletedTask).toEqual(task);
	});
});
