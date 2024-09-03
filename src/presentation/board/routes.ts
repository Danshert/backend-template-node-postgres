import { Router } from 'express';

import { AuthMiddleware } from '../middlewares/auth.middleware';
import { BoardService } from '../services';
import { BoardController } from './controller';

export class BoardRoutes {
	static get routes(): Router {
		const router = Router();

		const boardService = new BoardService();
		const controller = new BoardController(boardService);

		router.get('/', [AuthMiddleware.validateJWT], controller.getBoards);

		router.get(
			'/:id',
			[AuthMiddleware.validateJWT],
			controller.getBoardById,
		);

		router.post('/', [AuthMiddleware.validateJWT], controller.createBoard);

		router.put(
			'/:id',
			[AuthMiddleware.validateJWT],
			controller.updateBoard,
		);

		router.delete(
			'/:id',
			[AuthMiddleware.validateJWT],
			controller.deleteBoard,
		);

		return router;
	}
}
