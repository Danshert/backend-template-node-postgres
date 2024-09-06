/* eslint-disable no-unused-vars */
export class CreateBoardDto {
	private constructor(
		public readonly name: string,

		public readonly userId: string,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(object: { [key: string]: any }): [string?, CreateBoardDto?] {
		const { name = false, userId } = object;

		if (!name) return ['Missing name.'];
		if (name.length > 200) return ['Name is too long.'];

		if (!userId) return ['Missing user ID.'];

		return [undefined, new CreateBoardDto(name, userId.toString())];
	}
}
