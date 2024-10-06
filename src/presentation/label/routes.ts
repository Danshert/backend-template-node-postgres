import { Router } from 'express';

import { AuthMiddleware } from '../middlewares/auth.middleware';

import { LabelService } from '../services';
import { LabelController } from './controller';

export class LabelRoutes {
	static get routes(): Router {
		const router = Router();

		const labelService = new LabelService();
		const controller = new LabelController(labelService);

		router.use([AuthMiddleware.validateJWT]);

		/**
		 * @swagger
		 * /api/labels/{boardId}:
		 *   get:
		 *     summary: Get label by id
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Label
		 *     parameters:
		 *       - in: path
		 *         name: boardId
		 *         required: true
		 *         description: Label ID
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: Get label
		 *       400:
		 *         description: Invalid data
		 *       401:
		 *         description: Unauthorized
		 *       404:
		 *         description: Not found
		 *       500:
		 *         description: Internal server error
		 */
		router.get('/:id', controller.getLabels);

		/**
		 * @swagger
		 * /api/labels:
		 *   post:
		 *     summary: Create label
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Label
		 *     requestBody:
		 *       description: Label data
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             properties:
		 *               boardId:
		 *                 type: string
		 *               name:
		 *                 type: string
		 *               color:
		 *                 type: string
		 *             required:
		 *               - name
		 *     responses:
		 *       201:
		 *         description: Label created
		 *       400:
		 *         description: Invalid data
		 *       500:
		 *         description: Internal server error
		 */
		router.post('/', controller.createLabel);

		/**
		 * @swagger
		 * /api/labels/{id}:
		 *   put:
		 *     summary: Update label
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Label
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         description: Label ID
		 *         schema:
		 *           type: string
		 *     requestBody:
		 *       description: Label data
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             properties:
		 *               name:
		 *                 type: string
		 *               color:
		 *                 type: string
		 *             example:
		 *               name: Label
		 *     responses:
		 *       201:
		 *         description: Label updated
		 *       400:
		 *         description: Invalid data
		 *       500:
		 *         description: Internal server error
		 */
		router.put('/:id', controller.updateLabel);

		/**
		 * @swagger
		 * /api/labels/{id}:
		 *   delete:
		 *     summary: Delete label
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Label
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         description: Label ID
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: Deleted label
		 *       400:
		 *         description: Invalid data
		 *       401:
		 *         description: Unauthorized
		 *       404:
		 *         description: Not found
		 *       500:
		 *         description: Internal server error
		 */
		router.delete('/:id', controller.deleteLabel);

		return router;
	}
}
