/* eslint-disable no-unused-vars */
import { prisma } from '../../data/postgres';

import { LoginUserDto, RegisterUserDto } from '../../domain/dtos/auth';

import { UserEntity } from '../../domain/entities';
import { CustomError } from '../../domain/errors';

import { JwtAdapter, bcryptAdapter } from '../../config';

export class AuthService {
	constructor() {}

	public async registerUser(registerUserDto: RegisterUserDto) {
		const existUser = await prisma.user.findFirst({
			where: { email: registerUserDto.email },
		});

		if (existUser) throw CustomError.badRequest('Email already exist');

		try {
			const user = await prisma.user.create({
				data: {
					...registerUserDto,
					password: bcryptAdapter.hash(registerUserDto.password),
				},
			});

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, ...userEntity } = UserEntity.fromObject(user);

			const token = await JwtAdapter.generateToken({ id: user.id });

			if (!token) {
				throw CustomError.internalServer('Error while creating JWT');
			}

			return { user: userEntity, token };
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
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, ...userEntity } = UserEntity.fromObject(user);

			const token = await JwtAdapter.generateToken({ id: user.id });

			if (!token) {
				throw CustomError.internalServer('Error while creating JWT');
			}

			return { user: userEntity, token };
		} else {
			throw CustomError.unauthorized(`Invalid data`);
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

		const user = await prisma.user.findFirst({
			where: { id },
		});

		if (!user) {
			throw CustomError.internalServer('Error while getting user');
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...userEntity } = UserEntity.fromObject(user);

		return { user: userEntity, token: newToken };
	};
}
