/* eslint-disable no-unused-vars */
import { CustomError } from '../errors';

export enum UserRole {
	user = 'USER_ROLE',
	admin = 'ADMIN_ROLE',
}
export class UserEntity {
	constructor(
		public id: string,
		public name: string,
		public email: string,
		public emailValidated: boolean,
		public password: string,
		public role: UserRole[],
		public createdAt: string,
		public updatedAt: string,
		public imageUrl?: string,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static fromObject(object: { [key: string]: any }) {
		const {
			id,
			name,
			email,
			emailValidated,
			password,
			role,
			createdAt,
			updatedAt,
			imageUrl,
		} = object;

		if (!id) throw CustomError.badRequest('Missing id');
		if (!name) throw CustomError.badRequest('Missing name');
		if (!email) throw CustomError.badRequest('Missing email');

		if (emailValidated === undefined) {
			throw CustomError.badRequest('Missing emailValdiated');
		}

		if (!password) throw CustomError.badRequest('Missing password');
		if (!role) throw CustomError.badRequest('Missing role');

		return new UserEntity(
			id,
			name,
			email,
			emailValidated,
			password,
			role,
			createdAt,
			updatedAt,
			imageUrl,
		);
	}
}
