import { Router } from 'express';

import { AuthMiddleware } from '../middlewares/auth.middleware';

import { TaskService } from '../services';
import { TaskController } from './controller';

export class TaskRoutes {
	static get routes(): Router {
		const router = Router();

		const taskService = new TaskService();
		const controller = new TaskController(taskService);

		router.get('/', [AuthMiddleware.validateJWT], controller.getTasks);

		router.get(
			'/:id',
			[AuthMiddleware.validateJWT],
			controller.getTaskById,
		);

		router.post('/', [AuthMiddleware.validateJWT], controller.createTask);

		router.put('/:id', [AuthMiddleware.validateJWT], controller.updateTask);

		router.delete(
			'/:id',
			[AuthMiddleware.validateJWT],
			controller.deleteTask,
		);

		return router;
	}
}
