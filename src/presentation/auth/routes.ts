import { Router } from 'express';

import { AuthController } from './controller';
import { AuthService, EmailService } from '../services';
import { AuthMiddleware } from '../middlewares';

import { envs } from '../../config';

export class AuthRoutes {
	static get routes(): Router {
		const router = Router();

		const emailService = new EmailService(
			envs.MAILER_SERVICE,
			envs.MAILER_EMAIL,
			envs.MAILER_SECRET_KEY,
			envs.SEND_EMAIL,
		);

		const authService = new AuthService(emailService);

		const controller = new AuthController(authService);

		/**
		 * @swagger
		 * /api/auth/login:
		 *   post:
		 *     summary: User login
		 *     tags:
		 *       - Auth
		 *     requestBody:
		 *       description: Login
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             $ref: '#components/schemas/loginSchema'
		 *     responses:
		 *       200:
		 *         description: Successful login
		 *       400:
		 *         description: Missing data
		 *       401:
		 *         description: Invalid data
		 *       500:
		 *         description: Internal server error
		 */
		router.post('/login', controller.loginUser);

		/**
		 * @swagger
		 * /api/auth/register:
		 *   post:
		 *     summary: Register user
		 *     tags:
		 *       - Auth
		 *     requestBody:
		 *       description: User data
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             properties:
		 *               name:
		 *                 type: string
		 *               email:
		 *                 type: string
		 *                 format: email
		 *               password:
		 *                 type: string
		 *             required:
		 *               - name
		 *               - email
		 *               - password
		 *     responses:
		 *       201:
		 *         description: User created
		 *       400:
		 *         description: Invalid data
		 *       500:
		 *         description: Internal server error
		 */
		router.post('/register', controller.registerUser);

		/**
		 * @swagger
		 * /api/auth/update:
		 *   post:
		 *     summary: Update user
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Auth
		 *     requestBody:
		 *       description: Update user data
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             properties:
		 *               name:
		 *                 type: string
		 *               emailNotifications:
		 *                 type: boolean
		 *               password:
		 *                 type: string
		 *     responses:
		 *       200:
		 *         description: User updated
		 *       400:
		 *         description: Invalid data
		 *       404:
		 *         description: User not found
		 *       500:
		 *         description: Internal server error
		 */
		router.post(
			'/update',
			[AuthMiddleware.validateJWT],
			controller.updateUser,
		);

		/**
		 * @swagger
		 * /api/auth/renew-token:
		 *   post:
		 *     summary: Generate new token
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Auth
		 *     responses:
		 *       200:
		 *         description: New token generated
		 *       400:
		 *         description: Token required
		 *       401:
		 *         description: Invalid token
		 *       404:
		 *         description: User not found
		 *       500:
		 *         description: Internal server error
		 */
		router.post(
			'/renew-token',
			[AuthMiddleware.validateJWT],
			controller.renewToken,
		);

		router.get('/validate-email/:token', controller.validateEmail);

		/**
		 * @swagger
		 * /api/auth/request-password-change:
		 *   post:
		 *     summary: Request password change
		 *     tags:
		 *       - Auth
		 *     requestBody:
		 *       description: Email user
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             properties:
		 *               email:
		 *                 type: string
		 *                 format: email
		 *             required:
		 *               - email
		 *     responses:
		 *       200:
		 *         description: Email sended
		 *       400:
		 *         description: Email required or invalid email
		 *       404:
		 *         description: User not found
		 *       500:
		 *         description: Internal server error
		 */
		router.post(
			'/request-password-change',
			controller.requestPasswordChange,
		);

		router.get('/new-password/:token', controller.newPassword);

		return router;
	}
}
