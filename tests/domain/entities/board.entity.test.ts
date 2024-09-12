import { BoardEntity } from '../../../src/domain/entities';

describe('Tests in board entity', () => {
	const dataObject = {
		id: 'ABC',
		name: 'Test',
	};

	test('should create a board entity instance', () => {
		const board = BoardEntity.fromObject(dataObject);

		expect(board).toBeInstanceOf(BoardEntity);
		expect(board.id).toBe(dataObject.id);
		expect(board.name).toBe(dataObject.name);
	});

	test('should validate if missing id', () => {
		try {
			BoardEntity.fromObject({
				...dataObject,
				id: null,
			});
		} catch (error) {
			const errorString = `${error}`;
			expect(errorString).toContain('Error: Missing id');
		}
	});

	test('should validate if missing name', () => {
		try {
			BoardEntity.fromObject({
				...dataObject,
				name: null,
			});
		} catch (error) {
			const errorString = `${error}`;
			expect(errorString).toContain('Error: Missing name');
		}
	});
});
