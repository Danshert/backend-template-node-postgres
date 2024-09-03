import { Router } from 'express';

import { AuthRoutes } from './auth/routes';
import { BoardRoutes } from './board/routes';

export class AppRoutes {
	static get routes(): Router {
		const router = Router();

		router.use('/api/auth', AuthRoutes.routes);
		router.use('/api/boards', BoardRoutes.routes);

		return router;
	}
}
