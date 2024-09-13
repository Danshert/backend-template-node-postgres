/* eslint-disable no-unused-vars */
export class UpdateLabelDto {
	private constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly userId: string,
		public readonly color?: string,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(object: { [key: string]: any }): [string?, UpdateLabelDto?] {
		const { id, name, userId, color } = object;

		if (!id) return ['Missing ID.'];
		if (!userId) return ['Missing user ID.'];

		if (!name) return ['Missing name.'];
		if (name.length > 50) return ['Name is too long.'];

		return [
			undefined,
			new UpdateLabelDto(id, name, userId.toString(), color),
		];
	}
}
