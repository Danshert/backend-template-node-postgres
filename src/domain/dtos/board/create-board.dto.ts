/* eslint-disable no-unused-vars */
export class CreateBoardDto {
	private constructor(public readonly name: string) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(object: { [key: string]: any }): [string?, CreateBoardDto?] {
		const { name = false } = object;

		if (!name) return ['Missing name'];

		return [undefined, new CreateBoardDto(name)];
	}
}
