import { envs } from '../../src/config';

describe('Tests in envs', () => {
	test('should return env options', () => {
		expect(envs).toEqual({
			PORT: 3001,
			SERVER_URL: expect.any(String),
			POSTGRES_URL: expect.any(String),
			POSTGRES_DB: 'TODO_DB_TEST',
			JWT_SEED: expect.any(String),
			SEND_EMAIL: expect.any(Boolean),
			MAILER_SERVICE: 'gmail',
			MAILER_EMAIL: expect.any(String),
			MAILER_SECRET_KEY: expect.any(String),
			PUBLIC_VAPID_KEY: expect.any(String),
			PRIVATE_VAPID_KEY: expect.any(String),
			WEB_SERVICE_URL: expect.any(String),
		});
	});
});
