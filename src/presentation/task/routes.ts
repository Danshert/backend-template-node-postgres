import { Router } from 'express';

import { AuthMiddleware } from '../middlewares/auth.middleware';

import { TaskService } from '../services';
import { TaskController } from './controller';

export class TaskRoutes {
	static get routes(): Router {
		const router = Router();

		const taskService = new TaskService();
		const controller = new TaskController(taskService);

		router.use([AuthMiddleware.validateJWT]);

		/**
		 * @swagger
		 * /api/tasks:
		 *   get:
		 *     summary: Get tasks
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Task
		 *     parameters:
		 *       - in: query
		 *         name: parameters
		 *         schema:
		 *           type: object
		 *           properties:
		 *             boardId:
		 *               type: string
		 *             isActive:
		 *               type: boolean
		 *             status:
		 *               type: string
		 *               enum: ['', 'TODO', 'DOING', 'DONE']
		 *             page:
		 *               type: number
		 *               minimum: 1
		 *             limit:
		 *               type: number
		 *           required:
		 *             - boardId
		 *     responses:
		 *       201:
		 *         description: Get tasks
		 *       400:
		 *         description: Invalid data
		 *       500:
		 *         description: Internal server error
		 */
		router.get('/', controller.getTasks);

		/**
		 * @swagger
		 * /api/tasks/{id}:
		 *   get:
		 *     summary: Get task by id
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Task
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         description: Task ID
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: Get Task
		 *       400:
		 *         description: Invalid data
		 *       401:
		 *         description: Unauthorized
		 *       404:
		 *         description: Not found
		 *       500:
		 *         description: Internal server error
		 */
		router.get('/:id', controller.getTaskById);

		/**
		 * @swagger
		 * /api/tasks:
		 *   post:
		 *     summary: Create task
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Task
		 *     requestBody:
		 *       description: Task data
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             properties:
		 *               boardId:
		 *                 type: string
		 *               title:
		 *                 type: string
		 *             required:
		 *               - boardId
		 *               - title
		 *     responses:
		 *       201:
		 *         description: Task created
		 *       400:
		 *         description: Invalid data
		 *       500:
		 *         description: Internal server error
		 */
		router.post('/', controller.createTask);

		/**
		 * @swagger
		 * /api/tasks/{id}:
		 *   put:
		 *     summary: Update Task
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Task
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         description: Label ID
		 *         schema:
		 *           type: string
		 *     requestBody:
		 *       description: Task data
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             properties:
		 *               title:
		 *                 type: string
		 *               description:
		 *                 type: string
		 *               status:
		 *                 type: string
		 *                 enum: ['TODO', 'DOING', 'DONE']
		 *               labels:
		 *                 type: array
		 *                 items:
		 *                   type: string
		 *               startDate:
		 *                 type: string
		 *               endDate:
		 *                 type: string
		 *               reminderTime:
		 *                 type: string
		 *                 enum: ['None', 'Due date', '5 mins', '10 mins', '15 mins', '30 mins', '1 hr', '2 hrs', '1 day', '2 days']
		 *     responses:
		 *       201:
		 *         description: Task updated
		 *       400:
		 *         description: Invalid data
		 *       500:
		 *         description: Internal server error
		 */
		router.put('/:id', controller.updateTask);

		/**
		 * @swagger
		 * /api/tasks/{id}:
		 *   delete:
		 *     summary: Delete task
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Task
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         description: Task ID
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: Deleted Task
		 *       400:
		 *         description: Invalid data
		 *       401:
		 *         description: Unauthorized
		 *       404:
		 *         description: Not found
		 *       500:
		 *         description: Internal server error
		 */
		router.delete('/:id', controller.deleteTask);

		return router;
	}
}
