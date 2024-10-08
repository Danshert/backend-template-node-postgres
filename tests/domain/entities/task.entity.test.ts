import { TaskEntity } from '../../../src/domain/entities';

describe('Tests in task entity', () => {
	const dataObject = {
		id: 'ABC',
		title: 'Test',
	};

	test('should create a task entity instance', () => {
		const task = TaskEntity.fromObject(dataObject);

		expect(task).toBeInstanceOf(TaskEntity);
		expect(task.id).toBe(dataObject.id);
		expect(task.title).toBe(dataObject.title);
	});

	test('should validate if missing id', () => {
		try {
			TaskEntity.fromObject({
				...dataObject,
				id: null,
			});
		} catch (error) {
			const errorString = `${error}`;
			expect(errorString).toContain('Error: Missing id');
		}
	});

	test('should validate if missing title', () => {
		try {
			TaskEntity.fromObject({
				...dataObject,
				title: null,
			});
		} catch (error) {
			const errorString = `${error}`;
			expect(errorString).toContain('Error: Missing title');
		}
	});
});
