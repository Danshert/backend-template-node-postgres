/* eslint-disable no-unused-vars */
import { CustomError } from '../errors';

export class BoardEntity {
	constructor(
		public id: string,
		public name: string,
		public createdAt: string,
		public updatedAt: string,
		public isActive: string,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static fromObject(object: { [key: string]: any }) {
		const { id, _id, name, createdAt, updatedAt, isActive } = object;

		if (!_id && !id) throw CustomError.badRequest('Missing id');
		if (!name) throw CustomError.badRequest('Missing name');

		return new BoardEntity(_id || id, name, createdAt, updatedAt, isActive);
	}
}
