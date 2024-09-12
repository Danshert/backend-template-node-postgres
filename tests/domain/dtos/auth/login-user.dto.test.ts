import { LoginUserDto } from '../../../../src/domain/dtos';

describe('Test in login-user dto', () => {
	const dataObject = {
		email: 'test@test.com',
		password: '123456',
	};

	test('should create a login-user dto instance', () => {
		const [error, loginUserDto] = LoginUserDto.create(dataObject);

		expect(error).toBe(undefined);
		expect(loginUserDto).toBeInstanceOf(LoginUserDto);
	});

	test('should validate if missing email', () => {
		const [error, loginUserDto] = LoginUserDto.create({
			...dataObject,
			email: null,
		});

		expect(error).toContain('Missing email');
		expect(loginUserDto).toBe(undefined);
	});

	test('should validate if email is not valid', () => {
		const [error, loginUserDto] = LoginUserDto.create({
			...dataObject,
			email: 'test_test.com',
		});

		expect(error).toContain('Email is not valid');
		expect(loginUserDto).toBe(undefined);
	});

	test('should validate if missing password', () => {
		const [error, loginUserDto] = LoginUserDto.create({
			...dataObject,
			password: null,
		});

		expect(error).toContain('Missing password');
		expect(loginUserDto).toBe(undefined);
	});

	test('should validate if password is too short', () => {
		const [error, loginUserDto] = LoginUserDto.create({
			...dataObject,
			password: '12345',
		});

		expect(error).toContain('Password is too short');
		expect(loginUserDto).toBe(undefined);
	});
});
