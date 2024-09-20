import { TaskStatus } from '@prisma/client';

/* eslint-disable no-unused-vars */
export class CreateTaskDto {
	private constructor(
		public readonly title: string,
		public readonly userId: string,
		public readonly boardId: string,
		public readonly description: string,
		public readonly status: TaskStatus,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(object: { [key: string]: any }): [string?, CreateTaskDto?] {
		const {
			title,
			userId,
			boardId,
			description = '',
			status = TaskStatus.TODO,
		} = object;

		if (!title) return ['Missing title.'];
		if (title.length > 200) return ['Title is too long.'];

		if (!userId) return ['Missing user ID.'];
		if (!boardId) return ['Missing board ID.'];

		if (
			![TaskStatus.TODO, TaskStatus.DONE, TaskStatus.DONE].includes(
				status,
			)
		) {
			return [
				`It's not a valid status. Valid ones: ${TaskStatus.TODO}, ${TaskStatus.DOING}, ${TaskStatus.DONE}`,
			];
		}

		return [
			undefined,
			new CreateTaskDto(title, userId, boardId, description, status),
		];
	}
}
