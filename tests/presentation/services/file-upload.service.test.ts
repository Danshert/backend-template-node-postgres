import { UploadedFile } from 'express-fileupload';
import { FileUploadService } from '../../../src/presentation/services/file-upload.service';

describe('Tests in file upload service', () => {
	const fileUploadService = new FileUploadService();

	test('should upload a single file', async () => {
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

		const { fileName } = await fileUploadService.uploadSingle(
			file,
			'uploads/tests',
		);

		expect(typeof fileName).toBe('string');
	});

	test('should validate extension file', async () => {
		const file: UploadedFile = {
			name: 'test file',
			mimetype: 'application/pdf',
			mv: jest.fn(),
			encoding: '',
			data: Buffer.from('file', 'utf8'),
			tempFilePath: '',
			truncated: false,
			size: 10,
			md5: '',
		};

		try {
			await fileUploadService.uploadSingle(file, 'uploads/tests');
		} catch (error) {
			expect(`${error}`).toContain('Invalid extension');
		}
	});

	test('should upload multiples files', async () => {
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
			name: 'test file 2',
			mimetype: 'application/jpg',
			mv: jest.fn(),
			encoding: '',
			data: Buffer.from('file', 'utf8'),
			tempFilePath: '',
			truncated: false,
			size: 10,
			md5: '',
		};

		const fileNames = await fileUploadService.uploadMultiple(
			[file, file2],
			'uploads/tests',
		);

		expect(fileNames).toEqual(expect.any(Array));
		expect(fileNames.length).toBe(2);
	});
});
