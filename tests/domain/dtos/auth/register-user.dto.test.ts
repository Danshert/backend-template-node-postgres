import { RegisterUserDto } from '../../../../src/domain/dtos';

describe('Test in register-user dto', () => {
	const dataObject = {
		name: 'Test',
		email: 'test@test.com',
		password: '123456',
	};

	test('should create a login-user dto instance', () => {
		const [error, registerUserDto] = RegisterUserDto.create(dataObject);

		expect(error).toBe(undefined);
		expect(registerUserDto).toBeInstanceOf(RegisterUserDto);
	});

	test('should validate if missing name', () => {
		const [error, registerUserDto] = RegisterUserDto.create({
			...dataObject,
			name: null,
		});

		expect(error).toContain('Missing name');
		expect(registerUserDto).toBe(undefined);
	});

	test('should validate if name is too long', () => {
		const [error, registerUserDto] = RegisterUserDto.create({
			...dataObject,
			name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget ex ac ipsum volutpat feugiat iaculis et dolor. Proin commodo nulla ac scelerisque auctor. Vivamus semper, elit id tempus aliquam, nulla ante convallis arcu, et ultricies lorem eros id arcu.',
		});

		expect(error).toContain('Name is too long');
		expect(registerUserDto).toBe(undefined);
	});

	test('should validate if missing email', () => {
		const [error, registerUserDto] = RegisterUserDto.create({
			...dataObject,
			email: null,
		});

		expect(error).toContain('Missing email');
		expect(registerUserDto).toBe(undefined);
	});

	test('should validate if email is not valid', () => {
		const [error, registerUserDto] = RegisterUserDto.create({
			...dataObject,
			email: 'test_test.com',
		});

		expect(error).toContain('Email is not valid');
		expect(registerUserDto).toBe(undefined);
	});

	test('should validate if missing password', () => {
		const [error, registerUserDto] = RegisterUserDto.create({
			...dataObject,
			password: null,
		});

		expect(error).toContain('Missing password');
		expect(registerUserDto).toBe(undefined);
	});

	test('should validate if password is too short', () => {
		const [error, registerUserDto] = RegisterUserDto.create({
			...dataObject,
			password: '12345',
		});

		expect(error).toContain('Password is too short');
		expect(registerUserDto).toBe(undefined);
	});

	test('should validate if password is too long', () => {
		const [error, registerUserDto] = RegisterUserDto.create({
			...dataObject,
			password:
				'123456789098765432123456789098765432123456789098765432123456789098765432123456789098765432123456789098765321',
		});

		expect(error).toContain('Password is too long');
		expect(registerUserDto).toBe(undefined);
	});
});
