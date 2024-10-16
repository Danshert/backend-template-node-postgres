import { Request, Response } from 'express';

import { ReportService } from '../services';

export class ReportController {
	// eslint-disable-next-line no-unused-vars
	constructor(private readonly reportService: ReportService) {}

	generateUserReport = async (request: Request, response: Response) => {
		const pdfDoc = await this.reportService.generateUserReport(
			request.body.user.id,
		);

		response.setHeader('Content-Type', 'application/pdf');
		pdfDoc.info.Title = 'User report';
		pdfDoc.pipe(response);
		pdfDoc.end();
	};
}
