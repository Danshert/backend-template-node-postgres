import { CreateTaskDto } from '../../../../src/domain/dtos';

describe('Tests in create-task dto', () => {
	const dataObject = {
		title: 'Task',
		userId: '66e28f9bf12cf45a9487a01c',
		boardId: '66e28f9bf12cf45a9487a01c',
	};

	test('should create a create-task dto instance', () => {
		const [error, createBoardDto] = CreateTaskDto.create(dataObject);

		expect(error).toBe(undefined);
		expect(createBoardDto).toBeInstanceOf(CreateTaskDto);
	});

	test('should validate if missing title', () => {
		const [error, createBoardDto] = CreateTaskDto.create({
			...dataObject,
			title: null,
		});

		expect(error).toContain('Missing title');
		expect(createBoardDto).toBe(undefined);
	});

	test('should validate if title is too long', () => {
		const [error, createBoardDto] = CreateTaskDto.create({
			...dataObject,
			title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget ex ac ipsum volutpat feugiat iaculis et dolor. Proin commodo nulla ac scelerisque auctor. Vivamus semper, elit id tempus aliquam, nulla ante convallis arcu, et ultricies lorem eros id arcu.',
		});

		expect(error).toContain('Title is too long');
		expect(createBoardDto).toBe(undefined);
	});

	test('should validate if missing userId', () => {
		const [error, createBoardDto] = CreateTaskDto.create({
			...dataObject,
			userId: null,
		});

		expect(error).toContain('Missing user ID');
		expect(createBoardDto).toBe(undefined);
	});

	test('should validate if missing boardId', () => {
		const [error, createBoardDto] = CreateTaskDto.create({
			...dataObject,
			boardId: null,
		});

		expect(error).toContain('Missing board ID');
		expect(createBoardDto).toBe(undefined);
	});

	test('should validate if its not a valid status', () => {
		const [error, createBoardDto] = CreateTaskDto.create({
			...dataObject,
			status: 'ABC',
		});

		expect(error).toContain(`It's not a valid status`);
		expect(createBoardDto).toBe(undefined);
	});
});
