import { createRequest, createResponse } from 'node-mocks-http';
import { v4 as uuidv4 } from 'uuid';

import { BoardService } from '../../../src/presentation/services';
import { BoardController } from '../../../src/presentation/board/controller';

describe('Tests in board controller', () => {
	const boardService = new BoardService();
	const boardController = new BoardController(boardService);

	test('should return status code 200 in get boards controller', async () => {
		const response = createResponse();

		const request = createRequest({
			method: 'GET',
			url: '/api/boards',
			body: { user: { id: uuidv4() }, token: 'ABC' },
		});

		await boardController.getBoards(request, response);

		expect(response.statusCode).toBe(200);
	});

	test('should return status code 400 in get boards controller', async () => {
		const response = createResponse();

		const request = createRequest({
			method: 'GET',
			url: '/api/boards',
			body: { user: { id: '' }, token: 'ABC' },
		});

		await boardController.getBoards(request, response);

		const resp = response._getJSONData();

		expect(response.statusCode).toBe(400);
		expect(resp).toEqual(
			expect.objectContaining({ error: expect.any(String) }),
		);
	});

	test('should return status code 200 in get board by id controller', async () => {
		const response = createResponse();

		const request = createRequest({
			method: 'GET',
			url: '/api/boards/ABC',
			body: { user: { id: uuidv4() }, token: 'ABC' },
		});

		await boardController.getBoards(request, response);

		expect(response.statusCode).toBe(200);
	});

	test('should return status code 200 in create board controller', async () => {
		const response = createResponse();

		const request = createRequest({
			method: 'POST',
			url: '/api/boards',
			body: {
				name: 'Board',
				user: { id: uuidv4() },
				token: 'ABC',
			},
		});

		await boardController.createBoard(request, response);

		expect(response.statusCode).toBe(200);
	});

	test('should return status code 200 in update board controller', async () => {
		const response = createResponse();

		const request = createRequest({
			method: 'PUT',
			url: '/api/boards',
			params: { id: uuidv4() },
			body: {
				name: 'Board',
				user: { id: uuidv4() },
				token: 'ABC',
			},
		});

		await boardController.updateBoard(request, response);

		expect(response.statusCode).toBe(200);
	});

	test('should return status code 200 in delete board controller', async () => {
		const response = createResponse();

		const request = createRequest({
			method: 'DELETE',
			url: '/api/boards',
			params: { id: uuidv4() },
			body: {
				user: { id: uuidv4() },
				token: 'ABC',
			},
		});

		await boardController.deleteBoard(request, response);

		expect(response.statusCode).toBe(200);
	});
});
