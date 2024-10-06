import { envs } from '../src/config';

import { Server } from '../src/presentation/server';

jest.mock('../src/presentation/server');

describe('Testing app.ts', () => {
	test('should create server instance', () => {
		const serverApp = new Server({ port: envs.PORT });

		expect(serverApp).toBeInstanceOf(Server);
		expect(typeof serverApp.start).toBe('function');
	});
});
