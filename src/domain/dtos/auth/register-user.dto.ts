/* eslint-disable no-unused-vars */
import { regularExps } from '../../../config';

export class RegisterUserDto {
	constructor(
		public name: string,
		public email: string,
		public password: string,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
		const { name, email, password } = object;

		if (!name) return ['Missing name'];
		if (name.length > 200) return ['Name is too long.'];

		if (!email) return ['Missing email'];
		if (!regularExps.email.test(email)) return ['Email is not valid'];

		if (!password) return ['Missing password'];
		if (password.length < 6) return ['Password too short'];
		if (password.length > 100) return ['Password is too long.'];

		return [undefined, new RegisterUserDto(name, email, password)];
	}
}
