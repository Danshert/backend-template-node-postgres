import { UpdateUserDto } from '../../../../src/domain/dtos';

describe('Test in register-user dto', () => {
	const dataObject = {
		id: '66e28f9bf12cf45a9487a01c',
		name: 'Test',
		password: '123456',
	};

	test('should create a update-user dto instance', () => {
		const [error, updateUserDto] = UpdateUserDto.create(dataObject);

		expect(error).toBe(undefined);
		expect(updateUserDto).toBeInstanceOf(UpdateUserDto);
	});

	test('should validate if missing id', () => {
		const [error, updateUserDto] = UpdateUserDto.create({
			...dataObject,
			id: null,
		});

		expect(error).toContain('Missing id');
		expect(updateUserDto).toBe(undefined);
	});

	test('should validate if name is too long', () => {
		const [error, updateUserDto] = UpdateUserDto.create({
			...dataObject,
			name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget ex ac ipsum volutpat feugiat iaculis et dolor. Proin commodo nulla ac scelerisque auctor. Vivamus semper, elit id tempus aliquam, nulla ante convallis arcu, et ultricies lorem eros id arcu.',
		});

		expect(error).toContain('Name is too long');
		expect(updateUserDto).toBe(undefined);
	});

	test('should validate if password is too short', () => {
		const [error, updateUserDto] = UpdateUserDto.create({
			...dataObject,
			password: '12345',
		});

		expect(error).toContain('Password is too short');
		expect(updateUserDto).toBe(undefined);
	});

	test('should validate if password is too long', () => {
		const [error, updateUserDto] = UpdateUserDto.create({
			...dataObject,
			password:
				'123456789098765432123456789098765432123456789098765432123456789098765432123456789098765432123456789098765321',
		});

		expect(error).toContain('Password is too long');
		expect(updateUserDto).toBe(undefined);
	});
});
