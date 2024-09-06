/* eslint-disable no-unused-vars */
export class CreateLabelDto {
	private constructor(
		public readonly name: string,
		public readonly userId: string,
		public readonly boardId: string,
		public readonly color?: string,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(object: { [key: string]: any }): [string?, CreateLabelDto?] {
		const { name, userId, boardId, color } = object;

		if (!name) return ['Missing name'];
		if (name.length > 50) return ['Name is too long.'];

		if (!userId) return ['Missing user id'];
		if (!boardId) return ['Missing board id'];

		return [undefined, new CreateLabelDto(name, userId, boardId, color)];
	}
}
