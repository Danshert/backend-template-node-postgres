import request from 'supertest';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';

import { prisma } from '../../../src/data/postgres';

import { AppRoutes } from '../../../src/presentation/routes';

import {
	PrinterService,
	ReportService,
	WssService,
} from '../../../src/presentation/services';

import { testServer } from '../../test-server';

describe('Tests in reporter service', () => {
	beforeAll(async () => {
		const httpServer = createServer(testServer.app);
		WssService.initWss({ server: httpServer });

		testServer.setRoutes(AppRoutes.routes);

		await testServer.start();
	});

	afterAll(() => {
		testServer.close();
	});

	test('should return user report', async () => {
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

		const printerService = new PrinterService();

		const reportService = new ReportService(printerService);

		const pdf = await reportService.generateUserReport(user.id.toString());

		expect(pdf.info.Producer).toBe('pdfmake');
		expect(pdf.info.Title).toBe('Reporte de usuario');

		await prisma.user.delete({ where: { id: user.id } });
	});

	test('should return error if user not found', async () => {
		const printerService = new PrinterService();

		const reportService = new ReportService(printerService);

		const userId = 'ABC';

		try {
			await reportService.generateUserReport(userId);
		} catch (error) {
			expect(`${error}`).toContain(`User with ID:${userId} not found.`);
		}
	});
});
