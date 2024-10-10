import { envs } from '../../../src/config';

import { EmailService } from '../../../src/presentation/services';

describe('Tests in email service', () => {
	const options = {
		to: 'test@test.com',
		subject: 'Email test',
		htmlBody: '<h1>Email test</h1>',
	};

	test('should send an email', async () => {
		const emailService = new EmailService(
			envs.MAILER_SERVICE,
			envs.MAILER_EMAIL,
			envs.MAILER_SECRET_KEY,
			true,
		);

		const emailSended = await emailService.sendEmail(options);

		expect(emailSended).toBe(true);
	});

	test('should cant send an email', async () => {
		const emailService = new EmailService(
			envs.MAILER_SERVICE,
			'test@test.com',
			envs.MAILER_SECRET_KEY,
			true,
		);

		const emailSended = await emailService.sendEmail(options);

		expect(emailSended).toBe(false);
	});
});
