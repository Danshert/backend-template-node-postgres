/* eslint-disable no-unused-vars */

export class UpdateUserDto {
	constructor(
		public id: string,
		public name: string,
		public password: string,
		public updatedAt: Date,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(object: { [key: string]: any }): [string?, UpdateUserDto?] {
		const { id, name, password } = object;

		if (!id) return ['Missing id'];

		if (!name) return ['Missing name'];
		if (name.length > 200) return ['Name is too long.'];

		if (password && password.length < 6) return ['Password too short'];
		if (password && password.length > 100) return ['Password is too long.'];

		return [undefined, new UpdateUserDto(id, name, password, new Date())];
	}
}
