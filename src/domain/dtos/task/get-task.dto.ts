/* eslint-disable no-unused-vars */
export class GetTaskDto {
	private constructor(
		public readonly id: string,
		public readonly userId: string,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(props: { [key: string]: any }): [string?, GetTaskDto?] {
		const { id, userId } = props;

		if (!id) return ['Missing ID.'];
		if (!userId) return ['Missing user ID.'];

		return [undefined, new GetTaskDto(id.toString(), userId.toString())];
	}
}
