/* eslint-disable no-unused-vars */
import { prisma } from '../../data/postgres';

import { EmailService } from './email.service';

import {
	ChangePasswordDto,
	LoginUserDto,
	RegisterUserDto,
	UpdateUserDto,
} from '../../domain/dtos/auth';

import { UserEntity } from '../../domain/entities';
import { CustomError } from '../../domain/errors';

import { JwtAdapter, bcryptAdapter, envs } from '../../config';

export class AuthService {
	constructor(private readonly emailService: EmailService) {}

	public async registerUser(registerUserDto: RegisterUserDto) {
		const existUser = await prisma.user.findFirst({
			where: { email: registerUserDto.email },
		});

		if (existUser) throw CustomError.badRequest('Email already exist');

		try {
			await this.sendEmailValidationLink(registerUserDto.email);

			await prisma.user.create({
				data: {
					...registerUserDto,
					password: bcryptAdapter.hash(registerUserDto.password),
				},
			});

			return { ok: true, message: 'Account created.' };
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}

	public async loginUser(loginUserDto: LoginUserDto) {
		const user = await prisma.user.findFirst({
			where: { email: loginUserDto.email },
		});

		const isMatch =
			user && bcryptAdapter.compare(loginUserDto.password, user.password);

		if (user && isMatch) {
			if (!user.emailValidated) {
				throw CustomError.unauthorized(`Account not activated`);
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, emailValidated, ...userEntity } =
				UserEntity.fromObject(user);

			const token = await JwtAdapter.generateToken({ id: user.id });

			if (!token) {
				throw CustomError.internalServer('Error while creating JWT');
			}

			return { user: userEntity, token };
		} else {
			throw CustomError.unauthorized(`Invalid data`);
		}
	}

	public async updateUser(updateUserDto: UpdateUserDto) {
		if (updateUserDto.password) {
			updateUserDto.password = bcryptAdapter.hash(updateUserDto.password);
		}

		try {
			const user = await prisma.user.update({
				where: { id: updateUserDto.id },
				data: updateUserDto,
			});

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, emailValidated, ...updatedUser } = {
				...UserEntity.fromObject(user),
				...updateUserDto,
			};

			const token = await JwtAdapter.generateToken({
				id: updatedUser.id,
			});

			if (!token) {
				throw CustomError.internalServer('Error while creating JWT');
			}

			return { user: updatedUser, token };
		} catch {
			throw CustomError.notFound(`User not found`);
		}
	}

	public validateToken = async (token: string) => {
		const payload = await JwtAdapter.validateToken(token);
		if (!payload) throw CustomError.unauthorized('Invalid token');

		const { id } = payload as { id: string };

		const newToken = await JwtAdapter.generateToken({ id });

		if (!newToken) {
			throw CustomError.internalServer('Error while creating JWT');
		}

		const user = await prisma.user.findFirst({ where: { id } });

		if (!user) {
			throw CustomError.internalServer('Error while getting user');
		}

		if (!user.emailValidated) {
			throw CustomError.unauthorized(`Account not activated`);
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, emailValidated, ...userEntity } =
			UserEntity.fromObject(user);

		return { user: userEntity, token: newToken };
	};

	private sendEmailValidationLink = async (email: string) => {
		const token = await JwtAdapter.generateToken({ email });

		if (!token) {
			throw CustomError.internalServer('Error getting token');
		}

		const link = `${envs.WEB_SERVICE_URL}/auth/validate-email/${token}`;

		const html = `
			<h1>Validate your email</h1>
			<p>Click on the following link to validate your email</p>
			<a href="${link}">Validate your email: ${email}</a>
		`;

		const options = {
			to: email,
			subject: 'Validate your email',
			htmlBody: html,
		};

		const isSet = await this.emailService.sendEmail(options);

		if (!isSet) {
			throw CustomError.internalServer('Error senidng email');
		}

		return true;
	};

	public validateEmail = async (token: string) => {
		const payload = await JwtAdapter.validateToken(token);
		if (!payload) throw CustomError.unauthorized('Invalid token');

		const { email } = payload as { email: string };
		if (!email) throw CustomError.internalServer('Email not in token');

		const user = await prisma.user.findFirst({
			where: { email },
		});

		if (!user) throw CustomError.internalServer('Email not exists');

		await prisma.user.update({
			where: { email },
			data: { emailValidated: true },
		});

		return true;
	};

	public requestPasswordChange = async (email: string) => {
		const user = await prisma.user.findFirst({ where: { email } });

		if (!user) throw CustomError.internalServer('Email not exists');

		await this.sendEmailChangePasswordLink(user.email);

		return { ok: true, message: 'Email sended' };
	};

	private sendEmailChangePasswordLink = async (email: string) => {
		const token = await JwtAdapter.generateToken({ email });

		if (!token) {
			throw CustomError.internalServer('Error getting token');
		}

		const link = `${envs.WEB_SERVICE_URL}/auth/new-password/${token}`;

		const html = `
			<h1>Change your password</h1>
			<p>Click on the following link to change your password</p>
			<a href="${link}">Change your password</a>
		`;

		const options = {
			to: email,
			subject: 'Change your password',
			htmlBody: html,
		};

		const isSet = await this.emailService.sendEmail(options);

		if (!isSet) {
			throw CustomError.internalServer('Error senidng email');
		}

		return true;
	};

	public validateTokenToChangePassword = async (token: string) => {
		const payload = await JwtAdapter.validateToken(token);
		if (!payload) throw CustomError.unauthorized('Invalid token');

		const { email } = payload as { email: string };

		const user = await prisma.user.findFirst({ where: { email } });

		if (!user) {
			throw CustomError.internalServer('Error while getting user');
		}

		return true;
	};

	public changePassword = async (changePasswordDto: ChangePasswordDto) => {
		const payload = await JwtAdapter.validateToken(changePasswordDto.token);
		if (!payload) throw CustomError.unauthorized('Invalid token');

		const { email } = payload as { email: string };

		const user = await prisma.user.update({
			where: { email },
			data: { password: bcryptAdapter.hash(changePasswordDto.password) },
		});

		if (!user) {
			throw CustomError.internalServer('Error while getting user');
		}

		return { ok: true, message: 'Password changed' };
	};
}
