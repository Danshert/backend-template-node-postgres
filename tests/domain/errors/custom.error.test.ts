import { CustomError } from '../../../src/domain/errors';

describe('Tests in custom error class', () => {
	test('should create a custom error instance', () => {
		const customError = new CustomError(400, 'Bad request');

		expect(customError).toBeInstanceOf(CustomError);
	});

	test('should return a bad request error message', () => {
		const errorMessage = 'Bad request.';

		const error = `${CustomError.badRequest(errorMessage)}`;
		const errorString = `${error}`;

		expect(errorString).toContain(errorMessage);
	});

	test('should return an unauthorized error message', () => {
		const errorMessage = 'Unauthorized.';

		const error = `${CustomError.unauthorized(errorMessage)}`;
		const errorString = `${error}`;

		expect(errorString).toContain(errorMessage);
	});

	test('should return a forbidden error message', () => {
		const errorMessage = 'Forbidden.';

		const error = `${CustomError.forbidden(errorMessage)}`;
		const errorString = `${error}`;

		expect(errorString).toContain(errorMessage);
	});

	test('should return a not found error message', () => {
		const errorMessage = 'Not found.';

		const error = `${CustomError.notFound(errorMessage)}`;
		const errorString = `${error}`;

		expect(errorString).toContain(errorMessage);
	});

	test('should return an internal server error message', () => {
		const errorMessage = 'Internal server error.';

		const error = `${CustomError.internalServer(errorMessage)}`;
		const errorString = `${error}`;

		expect(errorString).toContain(errorMessage);
	});
});
