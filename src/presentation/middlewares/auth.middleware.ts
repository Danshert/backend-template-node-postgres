import { NextFunction, Request, Response } from 'express';

import { JwtAdapter } from '../../config';
import { UserEntity } from '../../domain/entities';

import { prisma } from '../../data/postgres';

export class AuthMiddleware {
	static async validateJWT(
		request: Request,
		response: Response,
		next: NextFunction,
	) {
		const authorization = request.header('Authorization');

		if (!authorization) {
			return response.status(401).json({ error: 'No token provided' });
		}

		if (!authorization.startsWith('Bearer ')) {
			return response.status(401).json({ error: 'Invalid bearer token' });
		}

		const token = authorization.split(' ').at(1) || '';

		try {
			const payload = await JwtAdapter.validateToken<{ id: string }>(
				token,
			);

			if (!payload) {
				return response.status(401).json({ error: 'Invalid token' });
			}

			const user = await prisma.user.findFirst({
				where: { id: payload.id },
			});

			if (!user) {
				return response
					.status(401)
					.json({ error: 'Invalid token - user' });
			}

			if (!user.emailValidated) {
				return response
					.status(401)
					.json({ error: 'Account not activated' });
			}

			request.body.user = UserEntity.fromObject(user);

			next();
		} catch (error) {
			console.log(error);
			response.status(500).json({ error: 'Internal server error' });
		}
	}
}
