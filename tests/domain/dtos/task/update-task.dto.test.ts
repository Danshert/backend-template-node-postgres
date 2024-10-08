import { UpdateTaskDto } from '../../../../src/domain/dtos';

describe('Tests in update-task dto', () => {
	const dataObject = {
		id: '66e28f9bf12cf45a9487a01c',
		userId: '66e28f9bf12cf45a9487a01c',
		name: 'Label',
	};

	test('should create a update-task dto instance', () => {
		const [error, updateTaskDto] = UpdateTaskDto.create(dataObject);

		expect(error).toBe(undefined);
		expect(updateTaskDto).toBeInstanceOf(UpdateTaskDto);
	});

	test('should validate if missing id', () => {
		const [error, updateTaskDto] = UpdateTaskDto.create({
			...dataObject,
			id: null,
		});

		expect(error).toContain('Missing ID');
		expect(updateTaskDto).toBe(undefined);
	});

	test('should validate if title is too long', () => {
		const [error, updateTaskDto] = UpdateTaskDto.create({
			...dataObject,
			title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget ex ac ipsum volutpat feugiat iaculis et dolor. Proin commodo nulla ac scelerisque auctor. Vivamus semper, elit id tempus aliquam, nulla ante convallis arcu, et ultricies lorem eros id arcu.',
		});

		expect(error).toContain('Title is too long');
		expect(updateTaskDto).toBe(undefined);
	});

	test('should validate if missing userId', () => {
		const [error, updateTaskDto] = UpdateTaskDto.create({
			...dataObject,
			userId: null,
		});

		expect(error).toContain('Missing user ID');
		expect(updateTaskDto).toBe(undefined);
	});

	test('should validate if its not a valid date', () => {
		const [error, updateTaskDto] = UpdateTaskDto.create({
			...dataObject,
			startDate: '01-01-2024',
		});

		expect(error).toContain(`It's not a valid datetime`);
		expect(updateTaskDto).toBe(undefined);
	});

	test('should validate if its not a valid labels', () => {
		const [error, updateTaskDto] = UpdateTaskDto.create({
			...dataObject,
			labels: 'labels',
		});

		expect(error).toContain(`Labels must be an array of label IDs`);
		expect(updateTaskDto).toBe(undefined);
	});

	test('should validate if its not a valid status', () => {
		const [error, updateTaskDto] = UpdateTaskDto.create({
			...dataObject,
			status: 'ABC',
		});

		expect(error).toContain(`It's not a valid status`);
		expect(updateTaskDto).toBe(undefined);
	});

	test('should validate if its not a valid reminder time', () => {
		const [error, updateTaskDto] = UpdateTaskDto.create({
			...dataObject,
			reminderTime: 'ABC',
		});

		expect(error).toContain(`It's not a valid reminder time`);
		expect(updateTaskDto).toBe(undefined);
	});
});
