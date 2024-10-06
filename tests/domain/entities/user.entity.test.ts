import { UserEntity, UserRole } from '../../../src/domain/entities/user.entity';

describe('Tests in user entity', () => {
	const dataObject = {
		id: 'ABC',
		name: 'Test',
		email: 'test@test.com',
		emailValidated: true,
		password: '123456',
		role: UserRole.user,
	};

	test('should create a user entity instance', () => {
		const user = UserEntity.fromObject(dataObject);

		expect(user).toBeInstanceOf(UserEntity);
		expect(user.id).toBe(dataObject.id);
		expect(user.name).toBe(dataObject.name);
		expect(user.email).toBe(dataObject.email);
		expect(user.role).toBe(dataObject.role);
	});

	test('should validate if missing id', () => {
		try {
			UserEntity.fromObject({
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
			UserEntity.fromObject({
				...dataObject,
				name: null,
			});
		} catch (error) {
			const errorString = `${error}`;
			expect(errorString).toContain('Error: Missing name');
		}
	});

	test('should validate if missing email', () => {
		try {
			UserEntity.fromObject({
				...dataObject,
				email: null,
			});
		} catch (error) {
			const errorString = `${error}`;
			expect(errorString).toContain('Error: Missing email');
		}
	});

	test('should validate if missing emailValidated', () => {
		try {
			UserEntity.fromObject({
				...dataObject,
				emailValidated: null,
			});
		} catch (error) {
			const errorString = `${error}`;
			expect(errorString).toContain('Error: Missing emailValidated');
		}
	});

	test('should validate if missing password', () => {
		try {
			UserEntity.fromObject({
				...dataObject,
				password: null,
			});
		} catch (error) {
			const errorString = `${error}`;
			expect(errorString).toContain('Error: Missing password');
		}
	});

	test('should validate if missing role', () => {
		try {
			UserEntity.fromObject({
				...dataObject,
				role: null,
			});
		} catch (error) {
			const errorString = `${error}`;
			expect(errorString).toContain('Error: Missing role');
		}
	});
});
