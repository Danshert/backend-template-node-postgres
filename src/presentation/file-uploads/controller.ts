import { Request, Response } from 'express';

import { CustomError } from '../../domain/errors';

import { FileUploadService } from '../services';
import { UploadedFile } from 'express-fileupload';

export class FileUploadController {
	// eslint-disable-next-line no-unused-vars
	constructor(private readonly fileUploadService: FileUploadService) {}

	private handleError = (error: unknown, response: Response) => {
		if (error instanceof CustomError) {
			return response
				.status(error.statusCode)
				.json({ error: error.message });
		}

		console.log(`${error}`);
		return response.status(500).json({ error: 'Internal server error' });
	};

	uploadFile = (request: Request, response: Response) => {
		const type = request.params.type;
		const file = request.body.files.at(0) as UploadedFile;

		this.fileUploadService
			.uploadSingle(file, `uploads/${type}`)
			.then((uploaded) => response.json(uploaded))
			.catch((error) => this.handleError(error, response));
	};

	uploadMultipleFile = (request: Request, response: Response) => {
		const type = request.params.type;
		const files = request.body.files as UploadedFile[];

		this.fileUploadService
			.uploadMultiple(files, `uploads/${type}`)
			.then((uploaded) => response.json(uploaded))
			.catch((error) => this.handleError(error, response));
	};
}
