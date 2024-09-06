import { Router } from 'express';

import { AuthMiddleware } from '../middlewares/auth.middleware';

import { LabelService } from '../services';
import { LabelController } from './controller';

export class LabelRoutes {
	static get routes(): Router {
		const router = Router();

		const labelService = new LabelService();
		const controller = new LabelController(labelService);

		router.get('/', [AuthMiddleware.validateJWT], controller.getLabels);

		router.get('/:id', [AuthMiddleware.validateJWT], controller.getLabels);

		router.post('/', [AuthMiddleware.validateJWT], controller.createLabel);

		router.put(
			'/:id',
			[AuthMiddleware.validateJWT],
			controller.updateLabel,
		);

		router.delete(
			'/:id',
			[AuthMiddleware.validateJWT],
			controller.deleteLabel,
		);

		return router;
	}
}
