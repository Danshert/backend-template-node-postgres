import { envs } from '../src/config';

import { Server } from '../src/presentation/server';
import { AppRoutes } from '../src/presentation/routes';

jest.mock('../src/presentation/server');

describe('Testing app.ts', () => {
	test('should create server instance', () => {
		const serverApp = new Server({
			port: envs.PORT,
			routes: AppRoutes.routes,
		});

		expect(serverApp).toBeInstanceOf(Server);
		expect(typeof serverApp.start).toBe('function');
	});

	test('should call server start with arguments and start', async () => {
		await import('../src/app');

		expect(Server).toHaveBeenCalledTimes(1);
		expect(Server).toHaveBeenCalledWith({
			port: envs.PORT,
			routes: expect.any(Function),
		});

		expect(Server.prototype.start).toHaveBeenCalled();
	});
});
