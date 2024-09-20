import { Router } from 'express';

import { AuthRoutes } from './auth/routes';
import { BoardRoutes } from './board/routes';
import { LabelRoutes } from './label/routes';
import { TaskRoutes } from './task/routes';

export class AppRoutes {
	static get routes(): Router {
		const router = Router();

		router.use('/api/auth', AuthRoutes.routes);
		router.use('/api/boards', BoardRoutes.routes);
		router.use('/api/labels', LabelRoutes.routes);
		router.use('/api/tasks', TaskRoutes.routes);

		return router;
	}
}
