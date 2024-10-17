import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { createServer } from 'http';
import { createRequest, createResponse } from 'node-mocks-http';

import { prisma } from '../../../src/data/postgres';

import { AppRoutes } from '../../../src/presentation/routes';

import { ReportController } from '../../../src/presentation/reports/controller';

import {
	PrinterService,
	ReportService,
	WssService,
} from '../../../src/presentation/services';

import { testServer } from '../../test-server';

describe('Tests in reports controller', () => {
	const printerService = new PrinterService();
	const reportService = new ReportService(printerService);

	const reportController = new ReportController(reportService);

	beforeAll(async () => {
		const httpServer = createServer(testServer.app);
		WssService.initWss({ server: httpServer });

		testServer.setRoutes(AppRoutes.routes);

		await testServer.start();
	});

	afterAll(() => {
		testServer.close();
	});

	test('should return status code 200 in generateUserReport controller', async () => {
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

		const mockResponse = createResponse();

		const mockRequest = createRequest({
			method: 'GET',
			url: '/api/reports/user',
			body: { user: { id: user.id }, token },
		});

		await reportController.generateUserReport(mockRequest, mockResponse);

		expect(mockResponse.statusCode).toBe(200);

		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should return status code 404 in generateUserReport controller', async () => {
		const mockResponse = createResponse();

		const mockRequest = createRequest({
			method: 'GET',
			url: '/api/reports/user',
			body: { user: { id: 'ABC' }, token: 'ABC' },
		});

		await reportController.generateUserReport(mockRequest, mockResponse);

		expect(mockResponse.statusCode).toBe(404);
	});
});
