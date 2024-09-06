/* eslint-disable no-unused-vars */
import { CustomError } from '../errors';

export class LabelEntity {
	constructor(
		public id: string,
		public name: string,
		public color: string,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static fromObject(object: { [key: string]: any }) {
		const { id, _id, name, color } = object;

		if (!_id && !id) throw CustomError.badRequest('Missing id');
		if (!name) throw CustomError.badRequest('Missing name');

		return new LabelEntity(_id || id, name, color);
	}
}
