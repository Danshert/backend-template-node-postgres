import { GetTaskDto } from '../../../../src/domain/dtos';

describe('Tests in get-task dto', () => {
	const dataObject = {
		id: '66e28f9bf12cf45a9487a01c',
		userId: '66e28f9bf12cf45a9487a01c',
	};

	test('should create a get-task dto instance', () => {
		const [error, getTaskDto] = GetTaskDto.create(dataObject);

		expect(error).toBe(undefined);
		expect(getTaskDto).toBeInstanceOf(GetTaskDto);
	});

	test('should validate if missing id', () => {
		const [error, getTaskDto] = GetTaskDto.create({
			...dataObject,
			id: null,
		});

		expect(error).toContain('Missing ID');
		expect(getTaskDto).toBe(undefined);
	});

	test('should validate if missing userId', () => {
		const [error, getTaskDto] = GetTaskDto.create({
			...dataObject,
			userId: null,
		});

		expect(error).toContain('Missing user ID');
		expect(getTaskDto).toBe(undefined);
	});
});
