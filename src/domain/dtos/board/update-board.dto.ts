/* eslint-disable no-unused-vars */
export class UpdateBoardDto {
	private constructor(
		public readonly id: string,
		public readonly userId: string,
		public readonly name: string,
		public readonly isActive: boolean,
		public readonly updatedAt: Date,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(props: { [key: string]: any }): [string?, UpdateBoardDto?] {
		const { id, userId, name = false, isActive = true } = props;

		if (!id) return ['Missing id'];
		if (!userId) return ['Missing user id'];
		if (!name) return ['Missing name'];

		let isActiveBoolean = isActive;

		if (typeof isActive !== 'boolean') {
			isActiveBoolean = isActive === 'true';
		}

		return [
			undefined,
			new UpdateBoardDto(id, userId, name, isActiveBoolean, new Date()),
		];
	}
}
