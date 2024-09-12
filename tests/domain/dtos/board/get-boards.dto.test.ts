import { GetBoardsDto } from '../../../../src/domain/dtos';

describe('Tests in get-boards dto', () => {
	const dataObject = {
		userId: '66e28f9bf12cf45a9487a01c',
		isActive: true,
	};

	test('should create a get-boards dto instance', () => {
		const [error, getBoardsDto] = GetBoardsDto.create(dataObject);

		expect(error).toBe(undefined);
		expect(getBoardsDto).toBeInstanceOf(GetBoardsDto);
	});

	test('should validate if missing user id', () => {
		const [error, getBoardsDto] = GetBoardsDto.create({
			...dataObject,
			userId: null,
		});

		expect(error).toContain('Missing user ID');
		expect(getBoardsDto).toBe(undefined);
	});
});
