import { Router } from 'express';

import { AuthController } from './controller';
import { AuthService, EmailService } from '../services';
import { envs } from '../../config';

export class AuthRoutes {
	static get routes(): Router {
		const router = Router();

		const emailService = new EmailService(
			envs.MAILER_SERVICE,
			envs.MAILER_EMAIL,
			envs.MAILER_SECRET_KEY,
			envs.SEND_EMAIL,
		);

		const authService = new AuthService(emailService);

		const controller = new AuthController(authService);

		router.post('/login', controller.loginUser);
		router.post('/register', controller.registerUser);
		router.post('/update', controller.updateUser);
		router.post('/change-password', controller.changePassword);

		router.get('/validate-token/:token', controller.validateToken);
		router.get('/validate-email/:token', controller.validateEmail);

		router.get(
			'/request-password-change/:email',
			controller.requestPasswordChange,
		);

		router.get('/new-password/:token', controller.newPassword);

		return router;
	}
}
