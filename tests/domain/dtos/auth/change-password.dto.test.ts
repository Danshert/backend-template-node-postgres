import { ChangePasswordDto } from '../../../../src/domain/dtos';

describe('Tests in change password dto', () => {
	const dataObject = {
		token: 'ABC',
		password: '123456',
	};

	test('should create a label entity instance', () => {
		const [error, changePasswordDto] = ChangePasswordDto.create(dataObject);

		expect(error).toBe(undefined);
		expect(changePasswordDto).toBeInstanceOf(ChangePasswordDto);
	});

	test('should validate if missing token', () => {
		const [error, changePasswordDto] = ChangePasswordDto.create({
			...dataObject,
			token: null,
		});

		expect(error).toContain('Missing token');
		expect(changePasswordDto).toBe(undefined);
	});

	test('should validate if missing password', () => {
		const [error, changePasswordDto] = ChangePasswordDto.create({
			...dataObject,
			password: null,
		});

		expect(error).toContain('Missing password');
		expect(changePasswordDto).toBe(undefined);
	});

	test('should validate if password is too short', () => {
		const [error, changePasswordDto] = ChangePasswordDto.create({
			...dataObject,
			password: '1234',
		});

		expect(error).toContain('Password is too short');
		expect(changePasswordDto).toBe(undefined);
	});
});
