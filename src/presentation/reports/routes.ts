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

		router.get('/', controller.generateUserReport);

		return router;
	}
}
