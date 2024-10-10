import { createServer } from 'http';

import { WssService } from '../../../src/presentation/services';
import { testServer } from '../../test-server';

describe('Tests in wss service', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should return instace', () => {
		const httpServer = createServer(testServer.app);
		WssService.initWss({ server: httpServer });

		expect(WssService.instance).toBeInstanceOf(WssService);
	});

	test('should initwss has been called', async () => {
		const logSpy = jest.spyOn(WssService, 'initWss');

		const httpServer = createServer(testServer.app);
		WssService.initWss({ server: httpServer });

		expect(logSpy).toHaveBeenCalled();
	});

	test('should start has been called', async () => {
		const logSpy = jest.spyOn(WssService.instance, 'start');

		WssService.instance.start();

		expect(logSpy).toHaveBeenCalled();
	});

	test('should sendMessage has been called', async () => {
		const logSpy = jest.spyOn(WssService.instance, 'sendMessage');

		WssService.instance.sendMessage('new-message', {
			userId: 'ABC',
		});

		expect(logSpy).toHaveBeenCalled();
	});
});
