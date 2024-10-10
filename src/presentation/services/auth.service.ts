/* eslint-disable no-unused-vars */
import path from 'path';
import fs from 'fs';

import { prisma } from '../../data/postgres';

import { EmailService } from './email.service';

import {
	LoginUserDto,
	RegisterUserDto,
	UpdateUserDto,
} from '../../domain/dtos/auth';

import { UserEntity } from '../../domain/entities';
import { CustomError } from '../../domain/errors';

import { JwtAdapter, bcryptAdapter, envs, regularExps } from '../../config';

export class AuthService {
	constructor(private readonly emailService: EmailService) {}

	public async registerUser(registerUserDto: RegisterUserDto) {
		const existUser = await prisma.user.findFirst({
			where: { email: registerUserDto.email },
		});

		if (existUser) throw CustomError.badRequest('Email already exist');

		try {
			await this.sendEmailValidationLink(registerUserDto.email);

			const user = await prisma.user.create({
				data: {
					...registerUserDto,
					password: bcryptAdapter.hash(registerUserDto.password),
				},
			});

			const token = await JwtAdapter.generateToken({ id: user.id });

			if (!token) {
				throw CustomError.internalServer('Error while creating JWT');
			}

			return { user: UserEntity.fromObject(user), token };
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

			const token = await JwtAdapter.generateToken({ id: user.id });

			if (!token) {
				throw CustomError.internalServer('Error while creating JWT');
			}

			return { user: UserEntity.fromObject(user), token };
		} else {
			throw CustomError.unauthorized(`Invalid data`);
		}
	}

	public async updateUser(updateUserDto: UpdateUserDto) {
		const { imageFile, ...updatedData } = updateUserDto;

		if (updateUserDto.password) {
			updateUserDto.password = bcryptAdapter.hash(updateUserDto.password);
		}

		let fileUrl;

		if (imageFile) {
			const fileExtension = imageFile.mimetype.split('/').at(1) ?? '';

			const destination = path.resolve(
				// eslint-disable-next-line no-undef
				__dirname,
				'../../../',
				'uploads/users',
			);

			if (!fs.existsSync(destination)) {
				fs.mkdirSync(destination);
			}

			const fileName = `${updatedData.id}.${fileExtension}`;
			fileUrl = `${envs.SERVER_URL}/api/images/users/${fileName}`;

			imageFile.mv(`${destination}/${fileName}`);
		}

		try {
			const user = await prisma.user.update({
				where: { id: updateUserDto.id },
				data: { ...updatedData, imageUrl: fileUrl },
			});

			const token = await JwtAdapter.generateToken({ id: user.id });

			if (!token) {
				throw CustomError.internalServer('Error while creating JWT');
			}

			return { user: UserEntity.fromObject(user), token };
		} catch {
			throw CustomError.notFound(`User not found`);
		}
	}

	public renewToken = async (token: string) => {
		const payload = await JwtAdapter.validateToken(token);
		if (!payload) throw CustomError.unauthorized('Invalid token');

		const { id } = payload as { id: string };

		const newToken = await JwtAdapter.generateToken({ id });

		if (!newToken) {
			throw CustomError.internalServer('Error while creating JWT');
		}

		const user = await prisma.user.findFirst({ where: { id } });

		if (!user) throw CustomError.notFound('User not found');

		if (!user.emailValidated) {
			throw CustomError.unauthorized(`Account not activated`);
		}

		return { user: UserEntity.fromObject(user), token: newToken };
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
			throw CustomError.internalServer('Error sending email');
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
		if (!regularExps.email.test(email)) {
			throw CustomError.badRequest(`Email is not valid.`);
		}

		const user = await prisma.user.findFirst({ where: { email } });

		if (!user) throw CustomError.notFound('User not found');

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
			throw CustomError.internalServer('Error sending email');
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
}
