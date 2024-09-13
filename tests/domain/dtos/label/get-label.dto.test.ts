import { GetLabelDto } from '../../../../src/domain/dtos';

describe('Tests in get-label dto', () => {
	const dataObject = {
		id: '66e28f9bf12cf45a9487a01c',
		userId: '66e28f9bf12cf45a9487a01c',
	};

	test('should create a get-label dto instance', () => {
		const [error, getLabelDto] = GetLabelDto.create(dataObject);

		expect(error).toBe(undefined);
		expect(getLabelDto).toBeInstanceOf(GetLabelDto);
	});

	test('should validate if missing ID', () => {
		const [error, getLabelDto] = GetLabelDto.create({
			...dataObject,
			id: null,
		});

		expect(error).toContain('Missing ID');
		expect(getLabelDto).toBe(undefined);
	});

	test('should validate if missing user ID', () => {
		const [error, getLabelDto] = GetLabelDto.create({
			...dataObject,
			userId: null,
		});

		expect(error).toContain('Missing user ID');
		expect(getLabelDto).toBe(undefined);
	});
});
