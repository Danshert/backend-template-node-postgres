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
		/**
		 * @swagger
		 * /api/notifications:
		 *   get:
		 *     summary: Get notifications
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Notification
		 *     parameters:
		 *       - in: query
		 *         name: boardId
		 *         schema:
		 *           type: object
		 *           properties:
		 *             boardId:
		 *               type: string
		 *           required:
		 *             - boardId
		 *     responses:
		 *       201:
		 *         description: Get notifications
		 *       400:
		 *         description: Invalid data
		 *       500:
		 *         description: Internal server error
		 */
		router.get('/', controller.getNotifications);

		/**
		 * @swagger
		 * /api/notifications/{id}:
		 *   put:
		 *     summary: Mark notification as seen
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Notification
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         description: Notification ID
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: Updated notification
		 *       400:
		 *         description: Invalid data
		 *       401:
		 *         description: Unauthorized
		 *       404:
		 *         description: Not found
		 *       500:
		 *         description: Internal server error
		 */
		router.put('/:id', controller.markNotificationAsSeen);

		router.post('/subscription', controller.subscription);
		router.get('/check-subscription', controller.checkSubscription);

		return router;
	}
}
