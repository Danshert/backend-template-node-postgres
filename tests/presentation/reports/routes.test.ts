import request from 'supertest';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';

import { prisma } from '../../../src/data/postgres';

import { AppRoutes } from '../../../src/presentation/routes';

import { WssService } from '../../../src/presentation/services';
import { testServer } from '../../test-server';

describe('Tests in reports routes', () => {
	beforeAll(async () => {
		const httpServer = createServer(testServer.app);
		WssService.initWss({ server: httpServer });

		testServer.setRoutes(AppRoutes.routes);

		await testServer.start();
	});

	afterAll(() => {
		testServer.close();
	});

	test('should get user report - /api/reports/user', async () => {
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
			.get('/api/reports/user')
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		await prisma.user.delete({ where: { id: user.id } });
	});
});
