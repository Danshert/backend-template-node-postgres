import path from 'path';
import { Request, Response } from 'express';

import { AuthService } from '../services/auth.service';
import {
	LoginUserDto,
	RegisterUserDto,
	UpdateUserDto,
} from '../../domain/dtos/auth';
import { CustomError } from '../../domain/errors';

export class AuthController {
	// eslint-disable-next-line no-unused-vars
	constructor(public readonly authService: AuthService) {}

	private handleError = (error: unknown, response: Response) => {
		if (error instanceof CustomError) {
			return response
				.status(error.statusCode)
				.json({ error: error.message });
		}

		console.log(`${error}`);
		return response.status(500).json({ error: 'Internal server error' });
	};

	registerUser = (request: Request, response: Response) => {
		const [error, registerUserDto] = RegisterUserDto.create(request.body);

		if (error) return response.status(400).json({ error });

		this.authService
			.registerUser(registerUserDto!)
			.then((user) => response.json(user))
			.catch((error) => this.handleError(error, response));
	};

	loginUser = (request: Request, response: Response) => {
		const [error, loginUserDto] = LoginUserDto.create(request.body);

		if (error) return response.status(400).json({ error });

		this.authService
			.loginUser(loginUserDto!)
			.then((user) => response.json(user))
			.catch((error) => this.handleError(error, response));
	};

	updateUser = (request: Request, response: Response) => {
		const [error, updateUserDto] = UpdateUserDto.create(request.body);

		if (error) return response.status(400).json({ error });

		this.authService
			.updateUser(updateUserDto!)
			.then((user) => response.json(user))
			.catch((error) => this.handleError(error, response));
	};

	validateToken = (request: Request, response: Response) => {
		const { token } = request.params;

		if (!token)
			return response.status(400).json({ error: 'Token required' });

		this.authService
			.validateToken(token)
			.then((resp) => response.json(resp))
			.catch((error) => this.handleError(error, response));
	};

	validateEmail = (request: Request, response: Response) => {
		const { token } = request.params;

		this.authService
			.validateEmail(token)
			.then(() =>
				response.sendFile(
					// eslint-disable-next-line no-undef
					path.join(__dirname, `../html/emailvalidated.html`),
				),
			)
			.catch(() =>
				response.sendFile(
					// eslint-disable-next-line no-undef
					path.join(__dirname, `../html/expiredToken.html`),
				),
			);
	};
}
