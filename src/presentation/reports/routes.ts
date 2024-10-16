import { Router } from 'express';

import { PrinterService, ReportService } from '../services';
import { ReportController } from './controller';

import { AuthMiddleware } from '../middlewares';

export class ReportsRoutes {
	static get routes(): Router {
		const router = Router();

		const printerService = new PrinterService();
		const reportService = new ReportService(printerService);

		const controller = new ReportController(reportService);

		router.use([AuthMiddleware.validateJWT]);

		/**
		 * @swagger
		 * /api/reports/user:
		 *   get:
		 *     summary: Generate user report
		 *     security:
		 *       - bearerAuth: []
		 *     tags:
		 *       - Reports
		 *     responses:
		 *       200:
		 *         description: Report generated
		 *       400:
		 *         description: Token required
		 *       401:
		 *         description: Invalid token
		 *       404:
		 *         description: User not found
		 *       500:
		 *         description: Internal server error
		 */
		router.get('/user', controller.generateUserReport);

		return router;
	}
}
