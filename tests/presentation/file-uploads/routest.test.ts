import request from 'supertest';
import { createServer } from 'http';

import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';

import { AppRoutes } from '../../../src/presentation/routes';
import { prisma } from '../../../src/data/postgres';

import { testServer } from '../../test-server';
import { WssService } from '../../../src/presentation/services';

describe('Tests in type middleware routes', () => {
	beforeAll(async () => {
		const httpServer = createServer(testServer.app);
		WssService.initWss({ server: httpServer });

		testServer.setRoutes(AppRoutes.routes);

		await testServer.start();
	});

	afterAll(() => {
		testServer.close();

		fs.remove(`${__dirname}/../../../uploads/tests/`);
	});

	test('should upload a single file', async () => {
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

		const filePath = `${__dirname}/../../files/node.jpg`;

		const { body } = await request(testServer.app)
			.post('/api/upload/single/tests')
			.set('Authorization', `Bearer ${token}`)
			.attach('file', filePath);

		expect(true).toBe(true);
		expect(body).toEqual({ fileName: expect.any(String) });

		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should upload a multiple file', async () => {
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

		const filePath = `${__dirname}/../../files/node.jpg`;

		const { body } = await request(testServer.app)
			.post('/api/upload/multiple/tests')
			.set('Authorization', `Bearer ${token}`)
			.attach('file', filePath)
			.attach('file', filePath);

		expect(body.length).toBe(2);

		expect(body[0]).toEqual({ fileName: expect.any(String) });
		expect(body[1]).toEqual({ fileName: expect.any(String) });

		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should validate if no files were selected', async () => {
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

		const {
			body: { error },
		} = await request(testServer.app)
			.post('/api/upload/single/tests')
			.set('Authorization', `Bearer ${token}`);

		expect(`${error}`).toContain('No files were selected');

		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should validate type files can upload', async () => {
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

		const filePath = `${__dirname}/../../files/node.jpg`;

		const {
			body: { error },
		} = await request(testServer.app)
			.post('/api/upload/single/reports')
			.set('Authorization', `Bearer ${token}`)
			.attach('file', filePath);

		expect(`${error}`).toContain('Invalid type');

		await prisma.user.delete({ where: { id: user.id } });
	});
});
