/* eslint-disable no-unused-vars */
export class PaginationDto {
	private constructor(
		public readonly page: number,
		public readonly limit: number,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(props: { [key: string]: any }): [string?, PaginationDto?] {
		const { page = 1, limit = 10 } = props;

		if (isNaN(+page) || isNaN(+limit)) {
			return ['Page and limit must be numbers'];
		}

		if (+page <= 0) return ['Page must be greater than 0'];
		if (+limit <= 0) return ['Limit must be greater than 0'];

		return [undefined, new PaginationDto(+page, +limit)];
	}
}
