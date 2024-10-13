import { createRequest, createResponse } from 'node-mocks-http';
import { v4 as uuidv4 } from 'uuid';

import { FileUploadService } from '../../../src/presentation/services';
import { FileUploadController } from '../../../src/presentation/file-uploads/controller';
import { UploadedFile } from 'express-fileupload';

describe('Tests in file uploads controller', () => {
	test('should return status code 200 in upload file controller', async () => {
		const fileUploadService = new FileUploadService();
		const fileUploadController = new FileUploadController(
			fileUploadService,
		);

		const response = createResponse();

		const file: UploadedFile = {
			name: 'test file',
			mimetype: 'application/jpg',
			mv: jest.fn(),
			encoding: '',
			data: Buffer.from('file', 'utf8'),
			tempFilePath: '',
			truncated: false,
			size: 10,
			md5: '',
		};

		const request = createRequest({
			method: 'POST',
			url: '/single',
			params: { type: 'users' },
			body: {
				user: { id: uuidv4() },
				token: 'ABC',
				files: [file],
			},
		});

		await fileUploadController.uploadFile(request, response);

		expect(response.statusCode).toBe(200);
	});

	test('should return status code 200 in upload multiple file controller', async () => {
		const fileUploadService = new FileUploadService();
		const fileUploadController = new FileUploadController(
			fileUploadService,
		);

		const response = createResponse();

		const file: UploadedFile = {
			name: 'test file',
			mimetype: 'application/jpg',
			mv: jest.fn(),
			encoding: '',
			data: Buffer.from('file', 'utf8'),
			tempFilePath: '',
			truncated: false,
			size: 10,
			md5: '',
		};

		const file2: UploadedFile = {
			name: 'test file ',
			mimetype: 'application/jpg',
			mv: jest.fn(),
			encoding: '',
			data: Buffer.from('file', 'utf8'),
			tempFilePath: '',
			truncated: false,
			size: 10,
			md5: '',
		};

		const request = createRequest({
			method: 'POST',
			url: '/multiple',
			params: { type: 'users' },
			body: {
				user: { id: uuidv4() },
				token: 'ABC',
				files: [file, file2],
			},
		});

		await fileUploadController.uploadMultipleFile(request, response);

		expect(response.statusCode).toBe(200);
	});
});
