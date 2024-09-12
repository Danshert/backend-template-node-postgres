import { UpdateBoardDto } from '../../../../src/domain/dtos';

describe('Tests in update-board dto', () => {
	const dataObject = {
		id: '66e28f9bf12cf45a9487a01c',
		userId: '66e28f9bf12cf45a9487a01c',
		name: 'Label',
	};

	test('should create a create-board dto instance', () => {
		const [error, updateBoardDto] = UpdateBoardDto.create(dataObject);

		expect(error).toBe(undefined);
		expect(updateBoardDto).toBeInstanceOf(UpdateBoardDto);
	});

	test('should validate if missing name', () => {
		const [error, updateBoardDto] = UpdateBoardDto.create({
			...dataObject,
			name: null,
		});

		expect(error).toContain('Missing name');
		expect(updateBoardDto).toBe(undefined);
	});

	test('should validate if name is too long', () => {
		const [error, updateBoardDto] = UpdateBoardDto.create({
			...dataObject,
			name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget ex ac ipsum volutpat feugiat iaculis et dolor. Proin commodo nulla ac scelerisque auctor. Vivamus semper, elit id tempus aliquam, nulla ante convallis arcu, et ultricies lorem eros id arcu.',
		});

		expect(error).toContain('Name is too long');
		expect(updateBoardDto).toBe(undefined);
	});

	test('should validate if missing id', () => {
		const [error, updateBoardDto] = UpdateBoardDto.create({
			...dataObject,
			id: null,
		});

		expect(error).toContain('Missing ID');
		expect(updateBoardDto).toBe(undefined);
	});

	test('should validate if missing userId', () => {
		const [error, updateBoardDto] = UpdateBoardDto.create({
			...dataObject,
			userId: null,
		});

		expect(error).toContain('Missing user ID');
		expect(updateBoardDto).toBe(undefined);
	});
});
