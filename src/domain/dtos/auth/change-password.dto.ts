/* eslint-disable no-unused-vars */

export class ChangePasswordDto {
	constructor(
		public token: string,
		public password: string,
	) {}

	static create(object: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	}): [string?, ChangePasswordDto?] {
		const { token, password } = object;

		if (!token) return ['Missing token'];
		if (!password) return ['Missing password'];
		if (password.length < 6) return ['Password too short'];

		return [undefined, new ChangePasswordDto(token, password)];
	}
}
