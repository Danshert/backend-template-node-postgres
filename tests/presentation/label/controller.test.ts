import { createRequest, createResponse } from 'node-mocks-http';
import { v4 as uuidv4 } from 'uuid';

import { LabelService } from '../../../src/presentation/services';
import { LabelController } from '../../../src/presentation/label/controller';

describe('Tests in label controller', () => {
	const labelService = new LabelService();
	const labelController = new LabelController(labelService);

	test('should return status code 200 in get labels controller', async () => {
		const response = createResponse();

		const request = createRequest({
			method: 'GET',
			url: '/api/labels',
			params: { id: uuidv4() },
			body: { user: { id: uuidv4() }, token: 'ABC' },
		});

		await labelController.getLabels(request, response);

		expect(response.statusCode).toBe(200);
	});

	test('should return status code 200 in create label controller', async () => {
		const response = createResponse();

		const request = createRequest({
			method: 'POST',
			url: '/api/labels',
			body: {
				name: 'Label',
				boardId: uuidv4(),
				user: { id: uuidv4() },
				token: 'ABC',
			},
		});

		await labelController.createLabel(request, response);

		expect(response.statusCode).toBe(200);
	});

	test('should return status code 200 in update label controller', async () => {
		const response = createResponse();

		const request = createRequest({
			method: 'PUT',
			url: '/api/labels',
			params: { id: uuidv4() },
			body: {
				name: 'Label',
				user: { id: uuidv4() },
				token: 'ABC',
			},
		});

		await labelController.updateLabel(request, response);

		expect(response.statusCode).toBe(200);
	});

	test('should return status code 200 in delete label controller', async () => {
		const response = createResponse();

		const request = createRequest({
			method: 'DELETE',
			url: '/api/labels',
			params: { id: uuidv4() },
			body: {
				user: { id: uuidv4() },
				token: 'ABC',
			},
		});

		await labelController.deleteLabel(request, response);

		expect(response.statusCode).toBe(200);
	});
});
