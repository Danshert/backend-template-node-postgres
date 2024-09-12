import { CreateBoardDto } from '../../../../src/domain/dtos';

describe('Tests in create-board dto', () => {
	const dataObject = {
		name: 'Label',
		userId: '66e28f9bf12cf45a9487a01c',
	};

	test('should create a create-board dto instance', () => {
		const [error, createBoardDto] = CreateBoardDto.create(dataObject);

		expect(error).toBe(undefined);
		expect(createBoardDto).toBeInstanceOf(CreateBoardDto);
	});

	test('should validate if missing name', () => {
		const [error, createBoardDto] = CreateBoardDto.create({
			...dataObject,
			name: null,
		});

		expect(error).toContain('Missing name');
		expect(createBoardDto).toBe(undefined);
	});

	test('should validate if name is too long', () => {
		const [error, createBoardDto] = CreateBoardDto.create({
			...dataObject,
			name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget ex ac ipsum volutpat feugiat iaculis et dolor. Proin commodo nulla ac scelerisque auctor. Vivamus semper, elit id tempus aliquam, nulla ante convallis arcu, et ultricies lorem eros id arcu.',
		});

		expect(error).toContain('Name is too long');
		expect(createBoardDto).toBe(undefined);
	});

	test('should validate if missing userId', () => {
		const [error, createBoardDto] = CreateBoardDto.create({
			...dataObject,
			userId: null,
		});

		expect(error).toContain('Missing user ID');
		expect(createBoardDto).toBe(undefined);
	});
});
