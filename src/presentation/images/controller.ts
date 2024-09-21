import fs from 'fs';
import path from 'path';

import { Request, Response } from 'express';

export class ImageController {
	constructor() {}

	getImage = (request: Request, response: Response) => {
		const { type = '', img = '' } = request.params;

		const imagePath = path.resolve(
			// eslint-disable-next-line no-undef
			__dirname,
			`../../../uploads/${type}/${img}`,
		);

		if (!fs.existsSync(imagePath)) {
			return response.status(404).send('Image not found');
		}

		response.sendFile(imagePath);
	};
}
