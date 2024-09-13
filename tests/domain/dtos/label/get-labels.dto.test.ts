import { GetLabelsDto } from '../../../../src/domain/dtos';

describe('Tests in get-labels dto', () => {
	const dataObject = {
		userId: '66e28f9bf12cf45a9487a01c',
		boardId: '66e28f9bf12cf45a9487a01c',
	};

	test('should create a get-label dto instance', () => {
		const [error, getLabelsDto] = GetLabelsDto.create(dataObject);

		expect(error).toBe(undefined);
		expect(getLabelsDto).toBeInstanceOf(GetLabelsDto);
	});

	test('should validate if missing user id', () => {
		const [error, getLabelsDto] = GetLabelsDto.create({
			...dataObject,
			userId: null,
		});

		expect(error).toContain('Missing user ID');
		expect(getLabelsDto).toBe(undefined);
	});

	test('should validate if missing board ID', () => {
		const [error, getLabelsDto] = GetLabelsDto.create({
			...dataObject,
			boardId: null,
		});

		expect(error).toContain('Missing board ID');
		expect(getLabelsDto).toBe(undefined);
	});
});
