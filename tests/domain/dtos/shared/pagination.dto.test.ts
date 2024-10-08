import { PaginationDto } from '../../../../src/domain/dtos';

describe('Tests in pagination dto', () => {
	const dataObject = {
		page: 1,
		limit: 10,
	};

	test('should create a get-notifications dto instance', () => {
		const [error, paginationDto] = PaginationDto.create(dataObject);

		expect(error).toBe(undefined);
		expect(paginationDto).toBeInstanceOf(PaginationDto);
	});

	test('should validate if its a page is a number', () => {
		const [error, paginationDto] = PaginationDto.create({
			...dataObject,
			page: 'one',
		});

		expect(error).toContain('Page and limit must be numbers');
		expect(paginationDto).toBe(undefined);
	});

	test('should validate if its a page valid', () => {
		const [error, paginationDto] = PaginationDto.create({
			...dataObject,
			page: 0,
		});

		expect(error).toContain('Page must be greater than 0');
		expect(paginationDto).toBe(undefined);
	});

	test('should validate if its a limit valid', () => {
		const [error, paginationDto] = PaginationDto.create({
			...dataObject,
			limit: 0,
		});

		expect(error).toContain('Limit must be greater than 0');
		expect(paginationDto).toBe(undefined);
	});
});
