import { Router } from 'express';

import { AuthMiddleware } from '../middlewares/auth.middleware';
import { BoardService } from '../services';
import { BoardController } from './controller';

export class BoardRoutes {
	static get routes(): Router {
		const router = Router();

		const boardService = new BoardService();
		const controller = new BoardController(boardService);

		router.use([AuthMiddleware.validateJWT]);

		/**
		 * @swagger
		 * /api/boards:
		 *   get:
		 *     summary: Get user boards
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Board
		 *     responses:
		 *       200:
		 *         description: List of user boards
		 *       401:
		 *         description: Unauthorized
		 *       500:
		 *         description: Internal server error
		 */
		router.get('/', controller.getBoards);

		/**
		 * @swagger
		 * /api/boards/{id}:
		 *   get:
		 *     summary: Get board by id
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Board
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         description: Board ID
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: Get board
		 *       400:
		 *         description: Invalid data
		 *       401:
		 *         description: Unauthorized
		 *       404:
		 *         description: Not found
		 *       500:
		 *         description: Internal server error
		 */
		router.get('/:id', controller.getBoardById);

		/**
		 * @swagger
		 * /api/boards:
		 *   post:
		 *     summary: Create board
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Board
		 *     requestBody:
		 *       description: Board data
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             properties:
		 *               name:
		 *                 type: string
		 *             required:
		 *               - name
		 *             example:
		 *               name: Board
		 *     responses:
		 *       201:
		 *         description: Board created
		 *       400:
		 *         description: Invalid data
		 *       500:
		 *         description: Internal server error
		 */
		router.post('/', controller.createBoard);

		/**
		 * @swagger
		 * /api/boards/{id}:
		 *   put:
		 *     summary: Update board
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Board
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         description: Board ID
		 *         schema:
		 *           type: string
		 *     requestBody:
		 *       description: Board data
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             properties:
		 *               name:
		 *                 type: string
		 *             example:
		 *               name: Board
		 *     responses:
		 *       200:
		 *         description: Board updated
		 *       400:
		 *         description: Invalid data
		 *       500:
		 *         description: Internal server error
		 */
		router.put('/:id', controller.updateBoard);

		/**
		 * @swagger
		 * /api/boards/{id}:
		 *   delete:
		 *     summary: Delete board by id
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Board
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         description: Board ID
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: Deleted board
		 *       400:
		 *         description: Invalid data
		 *       401:
		 *         description: Unauthorized
		 *       404:
		 *         description: Not found
		 *       500:
		 *         description: Internal server error
		 */
		router.delete('/:id', controller.deleteBoard);

		return router;
	}
}
