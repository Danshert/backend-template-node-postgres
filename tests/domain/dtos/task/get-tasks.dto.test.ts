import { GetTasksDto } from '../../../../src/domain/dtos';

describe('Tests in get-tasks dto', () => {
	const dataObject = {
		userId: '66e28f9bf12cf45a9487a01c',
		boardId: '66e28f9bf12cf45a9487a01c',
		isActive: true,
	};

	test('should create a get-tasks dto instance', () => {
		const [error, getTasksDto] = GetTasksDto.create(dataObject);

		expect(error).toBe(undefined);
		expect(getTasksDto).toBeInstanceOf(GetTasksDto);
	});

	test('should validate if missing user id', () => {
		const [error, getTasksDto] = GetTasksDto.create({
			...dataObject,
			userId: null,
		});

		expect(error).toContain('Missing user ID');
		expect(getTasksDto).toBe(undefined);
	});

	test('should validate if its not a valid status', () => {
		const [error, getTasksDto] = GetTasksDto.create({
			...dataObject,
			status: 'ABC',
		});

		expect(error).toContain(`It's not a valid status`);
		expect(getTasksDto).toBe(undefined);
	});

	test('should validate if isActive is boolean', () => {
		const [, getTasksDto] = GetTasksDto.create({
			...dataObject,
			isActive: 'true',
		});

		expect(getTasksDto?.isActive).toStrictEqual(expect.any(Boolean));
	});
});
