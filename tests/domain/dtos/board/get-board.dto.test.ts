import { GetBoardDto } from '../../../../src/domain/dtos';

describe('Tests in get-board dto', () => {
	const dataObject = {
		id: '66e28f9bf12cf45a9487a01c',
		userId: '66e28f9bf12cf45a9487a01c',
	};

	test('should create a get-board dto instance', () => {
		const [error, getBoardDto] = GetBoardDto.create(dataObject);

		expect(error).toBe(undefined);
		expect(getBoardDto).toBeInstanceOf(GetBoardDto);
	});

	test('should validate if missing id', () => {
		const [error, getBoardDto] = GetBoardDto.create({
			...dataObject,
			id: null,
		});

		expect(error).toContain('Missing ID');
		expect(getBoardDto).toBe(undefined);
	});

	test('should validate if missing userId', () => {
		const [error, getBoardDto] = GetBoardDto.create({
			...dataObject,
			userId: null,
		});

		expect(error).toContain('Missing user ID');
		expect(getBoardDto).toBe(undefined);
	});

	test('should validate if isActive is boolean', () => {
		const [, getBoardDto] = GetBoardDto.create({
			...dataObject,
			isActive: 'true',
		});

		expect(getBoardDto?.isActive).toStrictEqual(expect.any(Boolean));
	});
});
