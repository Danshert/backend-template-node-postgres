/* eslint-disable no-unused-vars */
import { CustomError } from '../errors';

export class NotificationEntity {
	constructor(
		public id: string,
		public message: string,
		public seen: boolean,
		public createdAt: string,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static fromObject(object: { [key: string]: any }) {
		const { id, _id, message, seen, createdAt } = object;

		if (!_id && !id) throw CustomError.badRequest('Missing id');
		if (!message) throw CustomError.badRequest('Missing message');

		return new NotificationEntity(_id || id, message, seen, createdAt);
	}
}
