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

		if (!id) return ['Missing id'];
		if (!name) return ['Missing name'];
		if (!userId) return ['Missing user id'];

		return [
			undefined,
			new UpdateLabelDto(id, name, userId.toString(), color),
		];
	}
}
