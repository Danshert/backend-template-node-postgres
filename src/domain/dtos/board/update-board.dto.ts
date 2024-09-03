/* eslint-disable no-unused-vars */
export class UpdateBoardDto {
	private constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly isActive: boolean,
		public readonly updatedAt: Date,
	) {}

	get values() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const returnObj: { [key: string]: any } = {};

		if (this.id) returnObj.id = this.id;
		if (this.name) returnObj.name = this.name;

		return returnObj;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(object: { [key: string]: any }): [string?, UpdateBoardDto?] {
		const { id, name = false, isActive = true } = object;

		if (!id) return ['Missing id'];
		if (!name) return ['Missing name'];

		let isActiveBoolean = isActive;

		if (typeof isActive !== 'boolean') {
			isActiveBoolean = isActive === 'true';
		}

		return [
			undefined,
			new UpdateBoardDto(id, name, isActiveBoolean, new Date()),
		];
	}
}
