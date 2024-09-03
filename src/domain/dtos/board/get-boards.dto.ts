/* eslint-disable no-unused-vars */
export class GetBoardsdDto {
	private constructor(public readonly isActive: boolean) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(props: { [key: string]: any }): [string?, GetBoardsdDto?] {
		const { isActive = true } = props;

		let isActiveBoolean = isActive;

		if (typeof isActive !== 'boolean') {
			isActiveBoolean = isActive === 'true';
		}

		return [undefined, new GetBoardsdDto(isActiveBoolean)];
	}
}
