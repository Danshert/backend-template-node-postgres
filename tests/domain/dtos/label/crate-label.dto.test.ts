import { CreateLabelDto } from '../../../../src/domain/dtos';

describe('Tests in create-label dto', () => {
	const dataObject = {
		name: 'Label',
		userId: '66e28f9bf12cf45a9487a01c',
		boardId: '66e28f9bf12cf45a9487a01c',
	};

	test('should create a create-label dto instance', () => {
		const [error, createLabelDto] = CreateLabelDto.create(dataObject);

		expect(error).toBe(undefined);
		expect(createLabelDto).toBeInstanceOf(CreateLabelDto);
	});

	test('should validate if missing name', () => {
		const [error, createLabelDto] = CreateLabelDto.create({
			...dataObject,
			name: null,
		});

		expect(error).toContain('Missing name');
		expect(createLabelDto).toBe(undefined);
	});

	test('should validate if name is too long', () => {
		const [error, createLabelDto] = CreateLabelDto.create({
			...dataObject,
			name: '1234567890987654321234567890987654321234567890987654321',
		});

		expect(error).toContain('Name is too long');
		expect(createLabelDto).toBe(undefined);
	});

	test('should validate if missing userId', () => {
		const [error, createLabelDto] = CreateLabelDto.create({
			...dataObject,
			userId: null,
		});

		expect(error).toContain('Missing user ID');
		expect(createLabelDto).toBe(undefined);
	});

	test('should validate if missing boardId', () => {
		const [error, createLabelDto] = CreateLabelDto.create({
			...dataObject,
			boardId: null,
		});

		expect(error).toContain('Missing board ID');
		expect(createLabelDto).toBe(undefined);
	});
});
