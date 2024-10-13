import { createRequest, createResponse } from 'node-mocks-http';

import { ImageController } from '../../../src/presentation/images/controller';

describe('Tests in image controller', () => {
	test('should return status code 404 in get image controller', async () => {
		const imageController = new ImageController();

		const response = createResponse();

		const request = createRequest({
			method: 'GET',
			url: '/api/images',
			params: { type: 'users', img: 'ABC' },
		});

		await imageController.getImage(request, response);

		expect(response.statusCode).toBe(404);
	});
});
