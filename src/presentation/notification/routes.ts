import { Router } from 'express';

import { AuthMiddleware } from '../middlewares';

import { NotificationService } from '../services';
import { NotificationController } from './controller';

export class NotificationRoutes {
	static get routes(): Router {
		const router = Router();

		const notificationService = new NotificationService();
		const controller = new NotificationController(notificationService);

		router.use([AuthMiddleware.validateJWT]);

		router.get('/', controller.getNotifications);
		router.put('/:id', controller.markNotificationAsSeen);

		router.post('/subscription', controller.subscription);
		router.get('/check-subscription', controller.checkSubscription);

		return router;
	}
}
