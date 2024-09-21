import { NextFunction, Request, Response } from 'express';

export class FileUploadMiddleware {
	static containFiles(
		request: Request,
		response: Response,
		next: NextFunction,
	) {
		const files = request.files;

		if (!files || Object.keys(files).length === 0) {
			return response
				.status(400)
				.json({ error: 'No files were selected' });
		}

		if (!Array.isArray(files.file)) {
			request.body.files = [files.file];
		} else {
			request.body.files = files.file;
		}

		next();
	}
}
