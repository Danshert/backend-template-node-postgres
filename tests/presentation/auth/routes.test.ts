import request from 'supertest';

import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';

import { prisma } from '../../../src/data/postgres';

import { UserRole } from '../../../src/domain/entities';

import { testServer } from '../../test-server';
import { WssService } from '../../../src/presentation/services';
import { AppRoutes } from '../../../src/presentation/routes';

describe('Tests in auth routes', () => {
	beforeAll(async () => {
		const httpServer = createServer(testServer.app);
		WssService.initWss({ server: httpServer });

		testServer.setRoutes(AppRoutes.routes);

		await testServer.start();
	});

	afterAll(async () => {
		await prisma.user.deleteMany();

		testServer.close();
	});

	test('should register user - /api/auth/register', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const { body } = await request(testServer.app)
			.post('/api/auth/register')
			.send(userData)
			.expect(201);

		expect(body).toEqual({
			user: {
				id: expect.any(String),
				name: userData.name,
				email: userData.email,
				emailNotifications: expect.any(Boolean),
				role: [UserRole.user],
				imageUrl: null,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			},
			token: expect.any(String),
		});
	});

	test('should login user - /api/auth/login', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const {
			body: { user },
		} = await request(testServer.app)
			.post('/api/auth/register')
			.send(userData)
			.expect(201);

		await prisma.user.update({
			where: { id: user.id },
			data: { emailValidated: true },
		});

		const { body } = await request(testServer.app)
			.post('/api/auth/login')
			.send({ email: user.email, password: userData.password })
			.expect(200);

		expect(body).toEqual({
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				emailNotifications: expect.any(Boolean),
				role: user.role,
				imageUrl: null,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			},
			token: expect.any(String),
		});
	});

	test('should update user - /api/auth/update', async () => {
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

		const updatedData = {
			name: 'Test updated',
		};

		const { body } = await request(testServer.app)
			.post('/api/auth/update')
			.send(updatedData)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(body).toEqual({
			user: {
				...updatedData,
				id: user.id,
				email: user.email,
				emailNotifications: expect.any(Boolean),
				role: user.role,
				imageUrl: null,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			},
			token: expect.any(String),
		});
	});

	test('should renew token - /api/auth/renew-token', async () => {
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

		const { body } = await request(testServer.app)
			.get('/api/auth/renew-token')
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(body).toEqual({
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				emailNotifications: expect.any(Boolean),
				role: user.role,
				imageUrl: null,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			},
			token: expect.any(String),
		});
	});

	test('should request password change - /api/auth/request-password-change', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const {
			body: { user },
		} = await request(testServer.app)
			.post('/api/auth/register')
			.send(userData)
			.expect(201);

		await prisma.user.update({
			where: { id: user.id },
			data: { emailValidated: true },
		});

		await request(testServer.app)
			.get('/api/auth/request-password-change')
			.send({ email: user.email })
			.expect(200);
	});

	test('should return new password page - /api/auth/new-password', async () => {
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

		await request(testServer.app)
			.get(`/api/auth/new-password/${token}`)
			.expect(200);
	});
});
