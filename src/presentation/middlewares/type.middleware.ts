import { NextFunction, Request, Response } from 'express';

export class TypeMiddleware {
	static validTypes(validTypes: string[]) {
		return (request: Request, response: Response, next: NextFunction) => {
			const type = request.url.split('/').at(2) ?? '';

			if (!validTypes.includes(type)) {
				return response.status(400).json({
					error: `Invalid type: ${type}, valid ones ${validTypes}`,
				});
			}

			next();
		};
	}
}
