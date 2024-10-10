import { createServer } from 'http';

import { v4 as uuidv4 } from 'uuid';

import { prisma } from '../../../src/data/postgres';

import { envs, JwtAdapter } from '../../../src/config';
import { UserEntity } from '../../../src/domain/entities';

import { AppRoutes } from '../../../src/presentation/routes';
import {
	AuthService,
	EmailService,
	WssService,
} from '../../../src/presentation/services';

import {
	LoginUserDto,
	RegisterUserDto,
	UpdateUserDto,
} from '../../../src/domain/dtos';

import { testServer } from '../../test-server';

describe('Tests in auth service', () => {
	const emailService = new EmailService(
		envs.MAILER_SERVICE,
		envs.MAILER_EMAIL,
		envs.MAILER_SECRET_KEY,
		envs.SEND_EMAIL,
	);

	beforeAll(async () => {
		const httpServer = createServer(testServer.app);
		WssService.initWss({ server: httpServer });

		testServer.setRoutes(AppRoutes.routes);

		await testServer.start();
	});

	afterAll(async () => {
		testServer.close();
	});

	test('should register user', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const authService = new AuthService(emailService);

		const { user, token } = await authService.registerUser(
			registerUserDto!,
		);

		expect(user).toBeInstanceOf(UserEntity);
		expect(typeof token).toBe('string');
	});

	test('should login user', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const resp = await authService.registerUser(registerUserDto!);

		await prisma.user.update({
			where: { id: resp.user.id },
			data: { emailValidated: true },
		});

		const [, loginUserDto] = LoginUserDto.create(userData);

		const { user, token } = await authService.loginUser(loginUserDto!);

		expect(user).toBeInstanceOf(UserEntity);
		expect(typeof token).toBe('string');
	});

	test('should return Error message: Account not activated in login', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData);

		await authService.registerUser(registerUserDto!);

		const [, loginUserDto] = LoginUserDto.create(userData);

		try {
			await authService.loginUser(loginUserDto!);
		} catch (error) {
			expect(`${error}`).toContain('Account not activated');
		}
	});

	test('should return Error message: Invalid data in login', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData);

		await authService.registerUser(registerUserDto!);

		const [, loginUserDto] = LoginUserDto.create({
			...userData,
			password: '1234567',
		});

		try {
			await authService.loginUser(loginUserDto!);
		} catch (error) {
			expect(`${error}`).toContain('Invalid data');
		}
	});

	test('should update user', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const { user } = await authService.registerUser(registerUserDto!);

		await prisma.user.update({
			where: { id: user.id },
			data: { emailValidated: true },
		});

		const image = {
			name: 'test file',
			mimetype: 'application/jpg',
			mv: jest.fn(),
			encoding: '',
			data: Buffer.from('file', 'utf8'),
			tempFilePath: '',
			truncated: false,
			size: 10,
			md5: '',
		};

		const updateData = {
			id: user.id,
			emailNotifications: true,
		};

		const [, updateUserDto] = UpdateUserDto.create({
			...updateData,
			image,
		});

		const { user: updatedUser } = await authService.updateUser(
			updateUserDto!,
		);

		expect(updatedUser).toEqual(
			expect.objectContaining({
				name: userData.name,
				email: userData.email,
				...updateData,
			}),
		);
	});

	test('should return Error message: User not found in update user', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData);

		await authService.registerUser(registerUserDto!);

		const [, updateUserDto] = UpdateUserDto.create({ id: 'ABC' });

		try {
			await authService.updateUser(updateUserDto!);
		} catch (error) {
			expect(`${error}`).toContain('User not found');
		}
	});

	test('should renew token', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const { user, token } = await authService.registerUser(
			registerUserDto!,
		);

		await prisma.user.update({
			where: { id: user.id },
			data: { emailValidated: true },
		});

		const { token: newToken } = await authService.renewToken(token + '');

		expect(typeof newToken).toBe('string');
	});

	test('should return Error message: User not found in renew token', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData);

		await authService.registerUser(registerUserDto!);

		const token = await JwtAdapter.generateToken({
			email: 'test@test.com',
		});

		try {
			await authService.renewToken(token + '');
		} catch (error) {
			expect(`${error}`).toContain('User not found');
		}
	});

	test('should return Error message: Account not activated` in renew token', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const { token } = await authService.registerUser(registerUserDto!);

		try {
			await authService.renewToken(token + '');
		} catch (error) {
			expect(`${error}`).toContain('Account not activated');
		}
	});

	test('should validate email', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const { user } = await authService.registerUser(registerUserDto!);

		const token = await JwtAdapter.generateToken({ email: user.email });

		const emailValidated = await authService.validateEmail(token + '');

		expect(emailValidated).toBe(true);
	});

	test('should return Error message: Invalid token` in validate email', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const { token } = await authService.registerUser(registerUserDto!);

		try {
			await authService.validateEmail(token + 'ABC');
		} catch (error) {
			expect(`${error}`).toContain('Invalid token');
		}
	});

	test('should return Error message: Email not in token` in validate email', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const { token } = await authService.registerUser(registerUserDto!);

		try {
			await authService.validateEmail(token + '');
		} catch (error) {
			expect(`${error}`).toContain('Email not in token');
		}
	});

	test('should return Error message: Email not exists` in validate email', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData);

		await authService.registerUser(registerUserDto!);

		const token = await JwtAdapter.generateToken({
			email: 'test@test.com',
		});

		try {
			await authService.validateEmail(token + '');
		} catch (error) {
			expect(`${error}`).toContain('Email not exists');
		}
	});

	test('should request password change', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const { user } = await authService.registerUser(registerUserDto!);

		const resp = await authService.requestPasswordChange(user.email);

		expect(resp).toEqual({
			ok: true,
			message: 'Email sended',
		});
	});

	test('should return Error message: Email is not valid` in request password change', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData);

		await authService.registerUser(registerUserDto!);

		try {
			await authService.requestPasswordChange('email.com');
		} catch (error) {
			expect(`${error}`).toContain('Email is not valid');
		}
	});

	test('should return Error message: User not found` in request password change', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData);

		await authService.registerUser(registerUserDto!);

		try {
			await authService.requestPasswordChange('test@email.com');
		} catch (error) {
			expect(`${error}`).toContain('User not found');
		}
	});

	test('should validate token to change password', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const { user } = await authService.registerUser(registerUserDto!);

		const token = await JwtAdapter.generateToken({ email: user.email });

		const tokenValidated = await authService.validateTokenToChangePassword(
			token + '',
		);

		expect(tokenValidated).toBe(true);
	});

	test('should return Error message: Invalid token` in validate token to change password', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData);

		await authService.registerUser(registerUserDto!);

		try {
			await authService.validateTokenToChangePassword('ABC');
		} catch (error) {
			expect(`${error}`).toContain('Invalid token');
		}
	});

	test('should return Error message: Error while getting user` in validate token to change password', async () => {
		const userData = {
			name: 'Test',
			email: `${uuidv4()}@test.com`,
			password: '123456',
		};

		const authService = new AuthService(emailService);

		const [, registerUserDto] = RegisterUserDto.create(userData);

		const { token } = await authService.registerUser(registerUserDto!);

		try {
			await authService.validateTokenToChangePassword(token + '');
		} catch (error) {
			expect(`${error}`).toContain('Error while getting user');
		}
	});
});
