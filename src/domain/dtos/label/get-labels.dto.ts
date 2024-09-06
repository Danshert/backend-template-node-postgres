/* eslint-disable no-unused-vars */
export class GetLabelsDto {
	private constructor(
		public readonly userId: string,
		public readonly boardId: string,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(props: { [key: string]: any }): [string?, GetLabelsDto?] {
		const { userId, boardId } = props;

		if (!userId) return ['Missing user ID.'];
		if (!boardId) return ['Missing board ID.'];

		return [
			undefined,
			new GetLabelsDto(userId.toString(), boardId.toString()),
		];
	}
}
