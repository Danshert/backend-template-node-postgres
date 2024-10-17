import { Request, Response } from 'express';

import { CustomError } from '../../domain';
import { ReportService } from '../services';

export class ReportController {
	// eslint-disable-next-line no-unused-vars
	constructor(private readonly reportService: ReportService) {}

	private handleError = (error: unknown, response: Response) => {
		if (error instanceof CustomError) {
			return response
				.status(error.statusCode)
				.json({ error: error.message });
		}

		console.log(`${error}`);
		return response.status(500).json({ error: 'Internal server error' });
	};

	generateUserReport = async (request: Request, response: Response) => {
		try {
			const pdfDoc = await this.reportService.generateUserReport(
				request.body.user.id,
			);

			response.setHeader('Content-Type', 'application/pdf');
			pdfDoc.info.Title = 'User report';
			pdfDoc.pipe(response);
			pdfDoc.end();
		} catch (error) {
			this.handleError(error, response);
		}
	};
}
