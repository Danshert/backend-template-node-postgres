import { Router } from 'express';

import { AuthMiddleware } from '../middlewares';

import { EmailService, NotificationService } from '../services';
import { NotificationController } from './controller';

import { envs } from '../../config';

export class NotificationRoutes {
	static get routes(): Router {
		const router = Router();

		const emailService = new EmailService(
			envs.MAILER_SERVICE,
			envs.MAILER_EMAIL,
			envs.MAILER_SECRET_KEY,
			envs.SEND_EMAIL,
		);

		const notificationService = new NotificationService(emailService);
		const controller = new NotificationController(notificationService);

		router.use([AuthMiddleware.validateJWT]);

		router.get('/', controller.getNotifications);
		router.put('/:id', controller.markNotificationAsSeen);

		router.post('/subscription', controller.subscription);
		router.get('/check-subscription', controller.checkSubscription);

		return router;
	}
}
