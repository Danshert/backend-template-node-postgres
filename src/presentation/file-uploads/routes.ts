import { Router } from 'express';

import { AuthMiddleware } from '../middlewares/auth.middleware';

import { FileUploadController } from './controller';
import { FileUploadService } from '../services';
import { FileUploadMiddleware, TypeMiddleware } from '../middlewares';

export class FileUploadRoutes {
	static get routes(): Router {
		const router = Router();

		const fileUploadService = new FileUploadService();
		const controller = new FileUploadController(fileUploadService);

		router.use([
			AuthMiddleware.validateJWT,
			FileUploadMiddleware.containFiles,
			TypeMiddleware.validTypes(['users', 'tasks', 'tests']),
		]);

		router.post('/single/:type', controller.uploadFile);

		router.post('/multiple/:type', controller.uploadMultipleFile);

		return router;
	}
}
