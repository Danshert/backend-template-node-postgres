import { LabelEntity } from '../../../src/domain/entities';

describe('Tests in label entity', () => {
	const dataObject = {
		id: 'ABC',
		name: 'Test',
	};

	test('should create a label entity instance', () => {
		const label = LabelEntity.fromObject(dataObject);

		expect(label).toBeInstanceOf(LabelEntity);
		expect(label.id).toBe(dataObject.id);
		expect(label.name).toBe(dataObject.name);
	});

	test('should validate if missing id', () => {
		try {
			LabelEntity.fromObject({
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
			LabelEntity.fromObject({
				...dataObject,
				name: null,
			});
		} catch (error) {
			const errorString = `${error}`;
			expect(errorString).toContain('Error: Missing name');
		}
	});
});
