/* eslint-disable no-unused-vars */
export class GetBoardDto {
	private constructor(
		public readonly id: string,
		public readonly userId: string,
		public readonly isActive: boolean,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(props: { [key: string]: any }): [string?, GetBoardDto?] {
		const { id, userId, isActive = true } = props;

		if (!id) return ['Missing ID.'];
		if (!userId) return ['Missing user ID.'];

		let isActiveBoolean = isActive;

		if (typeof isActive !== 'boolean') {
			isActiveBoolean = isActive === 'true';
		}

		return [undefined, new GetBoardDto(id, userId, isActiveBoolean)];
	}
}
