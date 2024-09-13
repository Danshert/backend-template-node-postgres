import { UpdateLabelDto } from '../../../../src/domain/dtos';

describe('Tests in update-label dto', () => {
	const dataObject = {
		id: '66e28f9bf12cf45a9487a01c',
		userId: '66e28f9bf12cf45a9487a01c',
		name: 'Test',
	};

	test('should create a get-label dto instance', () => {
		const [error, updateLabelDto] = UpdateLabelDto.create(dataObject);

		expect(error).toBe(undefined);
		expect(updateLabelDto).toBeInstanceOf(UpdateLabelDto);
	});

	test('should validate if missing ID', () => {
		const [error, updateLabelDto] = UpdateLabelDto.create({
			...dataObject,
			id: null,
		});

		expect(error).toContain('Missing ID');
		expect(updateLabelDto).toBe(undefined);
	});

	test('should validate if missing user ID', () => {
		const [error, updateLabelDto] = UpdateLabelDto.create({
			...dataObject,
			userId: null,
		});

		expect(error).toContain('Missing user ID');
		expect(updateLabelDto).toBe(undefined);
	});

	test('should validate if missing name', () => {
		const [error, updateLabelDto] = UpdateLabelDto.create({
			...dataObject,
			name: null,
		});

		expect(error).toContain('Missing name');
		expect(updateLabelDto).toBe(undefined);
	});

	test('should validate if name is too long', () => {
		const [error, updateLabelDto] = UpdateLabelDto.create({
			...dataObject,
			name: '1234567890987654321234567890987654321234567890987654321',
		});

		expect(error).toContain('Name is too long');
		expect(updateLabelDto).toBe(undefined);
	});
});
