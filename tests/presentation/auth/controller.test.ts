import { createRequest, createResponse } from 'node-mocks-http';
import { v4 as uuidv4 } from 'uuid';

import { envs } from '../../../src/config';

import { AuthController } from '../../../src/presentation/auth/controller';
import { AuthService, EmailService } from '../../../src/presentation/services';

describe('Tests in auth controller', () => {
	const emailService = new EmailService(
		envs.MAILER_SERVICE,
		envs.MAILER_EMAIL,
		envs.MAILER_SECRET_KEY,
		envs.SEND_EMAIL,
	);

	const authService = new AuthService(emailService);

	const authController = new AuthController(authService);

	test('should return status code 200 in register user controller', async () => {
		const request = createRequest({
			method: 'POST',
			url: '/api/auth/register',
			body: {
				name: 'Test',
				email: `${uuidv4()}@test.com`,
				password: '123456',
			},
		});

		const response = createResponse();

		await authController.registerUser(request, response);

		expect(response.statusCode).toBe(200);
	});

	test('should return status code 400 in register user controller', async () => {
		const request = createRequest({
			method: 'POST',
			url: '/api/auth/register',
			body: {
				name: 'Test',
				password: '123456',
			},
		});

		const response = createResponse();

		await authController.registerUser(request, response);

		const resp = response._getJSONData();

		expect(response.statusCode).toBe(400);
		expect(resp).toEqual(
			expect.objectContaining({ error: expect.any(String) }),
		);
	});

	test('should return status code 200 in login user controller', async () => {
		const request = createRequest({
			method: 'POST',
			url: '/api/auth/login',
			body: {
				email: `${uuidv4()}@test.com`,
				password: '123456',
			},
		});

		const response = createResponse();

		await authController.loginUser(request, response);

		expect(response.statusCode).toBe(200);
	});

	test('should return status code 400 in login user controller', async () => {
		const request = createRequest({
			method: 'POST',
			url: '/api/auth/login',
			body: {
				name: 'Test',
				password: '123456',
			},
		});

		const response = createResponse();

		await authController.loginUser(request, response);

		const resp = response._getJSONData();

		expect(response.statusCode).toBe(400);
		expect(resp).toEqual(
			expect.objectContaining({ error: expect.any(String) }),
		);
	});

	// test('should return status code 200 in update user controller', async () => {
	// 	const request = createRequest({
	// 		method: 'POST',
	// 		url: '/api/auth/update',
	// 		body: {
	// 			user: { id:uuidv4() token: 'ABC' },
	// 			name: 'Name updated',
	// 		},
	// 	});

	// 	const response = createResponse();

	// 	await authController.updateUser(request, response);

	// 	expect(response.statusCode).toBe(200);
	// });

	test('should return status code 400 in update user controller', async () => {
		const request = createRequest({
			method: 'POST',
			url: '/api/auth/update',
			body: {
				user: { id: '' },
				name: 'Name updated',
			},
		});

		const response = createResponse();

		await authController.updateUser(request, response);

		const resp = response._getJSONData();

		expect(response.statusCode).toBe(400);
		expect(resp).toEqual(
			expect.objectContaining({ error: expect.any(String) }),
		);
	});

	test('should return status code 200 in renew token controller', async () => {
		const request = createRequest({
			method: 'GET',
			url: '/api/auth/renew-token',
			body: { user: { id: uuidv4() }, token: 'ABC' },
		});

		const response = createResponse();

		await authController.renewToken(request, response);

		expect(response.statusCode).toBe(200);
	});

	test('should return status code 400 in renew token controller', async () => {
		const request = createRequest({
			method: 'GET',
			url: '/api/auth/renew-token',
			body: { user: { id: 'ABC' }, token: undefined },
		});

		const response = createResponse();

		await authController.renewToken(request, response);

		const resp = response._getJSONData();

		expect(response.statusCode).toBe(400);
		expect(resp).toEqual(
			expect.objectContaining({ error: expect.any(String) }),
		);
	});

	test('should return status code 200 in request password controller', async () => {
		const request = createRequest({
			method: 'GET',
			url: '/api/auth/request-password-change',
			body: { email: 'test@test.com' },
		});

		const response = createResponse();

		await authController.requestPasswordChange(request, response);

		expect(response.statusCode).toBe(200);
	});

	test('should return status code 400 in request password controller', async () => {
		const request = createRequest({
			method: 'GET',
			url: '/api/auth/request-password-change',
		});

		const response = createResponse();

		await authController.requestPasswordChange(request, response);

		const resp = response._getJSONData();

		expect(response.statusCode).toBe(400);
		expect(resp).toEqual(
			expect.objectContaining({ error: expect.any(String) }),
		);
	});
});
