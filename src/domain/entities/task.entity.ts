/* eslint-disable no-unused-vars */
import { CustomError } from '../errors';

export class TaskEntity {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public status: string,
		public startDate: string,
		public endDate: string,
		public reminder: boolean,
		public labels: { userId: string; boardId: string }[],
		public createdAt: string,
		public updatedAt: string,
		public isActive: string,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static fromObject(object: { [key: string]: any }) {
		const {
			id,
			_id,
			title,
			description,
			status,
			startDate,
			endDate,
			reminder = false,
			labels,
			createdAt,
			updatedAt,
			isActive,
		} = object;

		if (!_id && !id) throw CustomError.badRequest('Missing id');
		if (!title) throw CustomError.badRequest('Missing name');
		if (!status) throw CustomError.badRequest('Missing status');

		// const idsLabels

		return new TaskEntity(
			_id || id,
			title,
			description,
			status,
			startDate,
			endDate,
			reminder,
			labels,
			createdAt,
			updatedAt,
			isActive,
		);
	}
}
