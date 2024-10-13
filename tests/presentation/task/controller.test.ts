import { createRequest, createResponse } from 'node-mocks-http';
import { v4 as uuidv4 } from 'uuid';

import { TaskService } from '../../../src/presentation/services';
import { TaskController } from '../../../src/presentation/task/controller';

describe('Tests in task controller', () => {
	const taskService = new TaskService();
	const taskController = new TaskController(taskService);

	test('should return status code 200 in get tasks controller', async () => {
		const response = createResponse();

		const request = createRequest({
			method: 'GET',
			url: '/api/tasks',
			body: {
				boardId: uuidv4(),
				user: { id: uuidv4() },
				token: 'ABC',
			},
		});

		await taskController.getTasks(request, response);

		expect(response.statusCode).toBe(200);
	});

	test('should return status code 200 in create label controller', async () => {
		const response = createResponse();

		const request = createRequest({
			method: 'POST',
			url: '/api/tasks',
			body: {
				title: 'Task',
				boardId: uuidv4(),
				user: { id: uuidv4() },
				token: 'ABC',
			},
		});

		await taskController.createTask(request, response);

		expect(response.statusCode).toBe(200);
	});

	test('should return status code 200 in update task controller', async () => {
		const response = createResponse();

		const request = createRequest({
			method: 'PUT',
			url: '/api/tasks',
			params: { id: uuidv4() },
			body: {
				title: 'Task',
				user: { id: uuidv4() },
				token: 'ABC',
			},
		});

		await taskController.updateTask(request, response);

		expect(response.statusCode).toBe(200);
	});

	test('should return status code 200 in delete task controller', async () => {
		const response = createResponse();

		const request = createRequest({
			method: 'DELETE',
			url: '/api/tasks',
			params: { id: uuidv4() },
			body: {
				user: { id: uuidv4() },
				token: 'ABC',
			},
		});

		await taskController.deleteTask(request, response);

		expect(response.statusCode).toBe(200);
	});
});
