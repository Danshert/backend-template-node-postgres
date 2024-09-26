import { Router } from 'express';

import { AuthMiddleware } from '../middlewares';

import { NotificationService } from '../services';
import { NotificationController } from './controller';

export class NotificationRoutes {
	static get routes(): Router {
		const router = Router();

		const notificationService = new NotificationService();
		const controller = new NotificationController(notificationService);

		router.get(
			'/',
			[AuthMiddleware.validateJWT],
			controller.getNotifications,
		);

		router.put(
			'/:id',
			[AuthMiddleware.validateJWT],
			controller.markNotificationAsSeen,
		);

		return router;
	}
}
