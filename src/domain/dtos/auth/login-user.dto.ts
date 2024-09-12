/* eslint-disable no-unused-vars */
import { regularExps } from '../../../config';

export class LoginUserDto {
	constructor(
		public email: string,
		public password: string,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
		const { email, password } = object;

		if (!email) return ['Missing email.'];
		if (!regularExps.email.test(email)) return ['Email is not valid.'];
		if (!password) return ['Missing password.'];
		if (password.length < 6) return ['Password is too short.'];

		return [undefined, new LoginUserDto(email, password)];
	}
}
