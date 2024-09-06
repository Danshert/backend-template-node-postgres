/* eslint-disable no-unused-vars */
export class GetLabelDto {
	private constructor(
		public readonly id: string,
		public readonly userId: string,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(props: { [key: string]: any }): [string?, GetLabelDto?] {
		const { id, userId } = props;

		if (!id) return ['Missing id'];
		if (!userId) return ['Missing user'];

		return [undefined, new GetLabelDto(id.toString(), userId.toString())];
	}
}
