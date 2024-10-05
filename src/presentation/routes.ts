import { Router } from 'express';

import { AuthRoutes } from './auth/routes';
import { BoardRoutes } from './board/routes';
import { LabelRoutes } from './label/routes';
import { TaskRoutes } from './task/routes';
import { FileUploadRoutes } from './file-uploads/routes';
import { ImageRoutes } from './images/routes';
import { NotificationRoutes } from './notification/routes';

export class AppRoutes {
	static get routes(): Router {
		const router = Router();

		router.use('/api/auth', AuthRoutes.routes);
		router.use('/api/boards', BoardRoutes.routes);
		router.use('/api/labels', LabelRoutes.routes);
		router.use('/api/tasks', TaskRoutes.routes);
		router.use('/api/upload', FileUploadRoutes.routes);
		router.use('/api/images', ImageRoutes.routes);
		router.use('/api/notifications', NotificationRoutes.routes);

		return router;

		/**
		 * @swagger
		 * components:
		 *   securitySchemes:
		 *     bearerAuth:
		 *       type: http
		 *       scheme: bearer
		 *       bearerFormat: JWT
		 */

		/**
		 * @swagger
		 * components:
		 *   schemas:
		 *     loginSchema:
		 *       type: object
		 *       properties:
		 *         email:
		 *           type: string
		 *           format: email
		 *           description: User email
		 *         password:
		 *           type: string
		 *           description: User password
		 *       required:
		 *         - email
		 *         - password
		 */
	}
}
