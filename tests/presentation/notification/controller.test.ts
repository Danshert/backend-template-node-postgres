import { createServer } from 'http';
import { createRequest, createResponse } from 'node-mocks-http';
import { v4 as uuidv4 } from 'uuid';

import { envs } from '../../../src/config';

import { AppRoutes } from '../../../src/presentation/routes';
import { NotificationController } from '../../../src/presentation/notification/controller';

import {
	EmailService,
	NotificationService,
	WssService,
} from '../../../src/presentation/services';

import { testServer } from '../../test-server';

describe('Tests in notification controller', () => {
	beforeAll(async () => {
		const httpServer = createServer(testServer.app);
		WssService.initWss({ server: httpServer });

		testServer.setRoutes(AppRoutes.routes);

		await testServer.start();
	});

	afterAll(() => {
		testServer.close();
	});

	const emailService = new EmailService(
		envs.MAILER_SERVICE,
		envs.MAILER_EMAIL,
		envs.MAILER_SECRET_KEY,
		envs.SEND_EMAIL,
	);

	test('should return status code 200 in get notifications controller', async () => {
		const notificationService = new NotificationService(emailService);

		const notificationController = new NotificationController(
			notificationService,
		);

		const response = createResponse();

		const request = createRequest({
			method: 'GET',
			url: '/api/notifications',
			body: {
				boardId: uuidv4(),
				user: { id: uuidv4() },
				token: 'ABC',
			},
		});

		await notificationController.getNotifications(request, response);

		expect(response.statusCode).toBe(200);
	});

	test('should return status code 200 in mark notification controller', async () => {
		const notificationService = new NotificationService(emailService);

		const notificationController = new NotificationController(
			notificationService,
		);

		const response = createResponse();

		const request = createRequest({
			method: 'PUT',
			url: '/api/notifications',
			params: { id: uuidv4() },
			body: {
				user: { id: uuidv4() },
				token: 'ABC',
			},
		});

		await notificationController.markNotificationAsSeen(request, response);

		expect(response.statusCode).toBe(200);
	});

	test('should return status code 200 in subscription controller', async () => {
		const notificationService = new NotificationService(emailService);

		const notificationController = new NotificationController(
			notificationService,
		);

		const response = createResponse();

		const request = createRequest({
			method: 'POST',
			url: '/api/notifications/subscription',
			params: { id: uuidv4() },
			body: {
				user: { id: uuidv4() },
				token: 'ABC',
				endpoint: 'ABC',
				expirationTime: null,
				keys: {
					auth: '',
					p256dh: '',
				},
			},
		});

		await notificationController.subscription(request, response);

		expect(response.statusCode).toBe(200);
	});

	test('should return status code 200 in check-subscription controller', async () => {
		const notificationService = new NotificationService(emailService);

		const notificationController = new NotificationController(
			notificationService,
		);

		const response = createResponse();

		const request = createRequest({
			method: 'GET',
			url: '/api/notifications/check-subscription',
			params: { id: uuidv4() },
			body: {
				user: { id: uuidv4() },
				token: 'ABC',
				endpoint: 'ABC',
				expirationTime: null,
				keys: {
					auth: '',
					p256dh: '',
				},
			},
		});

		await notificationController.checkSubscription(request, response);

		expect(response.statusCode).toBe(200);
	});
});
