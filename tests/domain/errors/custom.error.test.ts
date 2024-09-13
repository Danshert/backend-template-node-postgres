import { CustomError } from '../../../src/domain/errors';

describe('Tests in custom error class', () => {
	test('should create a custom error instance', () => {
		const customError = new CustomError(400, 'Bad request');

		expect(customError).toBeInstanceOf(CustomError);
	});

	test('should return an error message', () => {
		const errorMessage = 'Bad request.';

		const error = `${CustomError.badRequest(errorMessage)}`;
		const errorString = `${error}`;

		expect(errorString).toContain(errorMessage);
	});
});
