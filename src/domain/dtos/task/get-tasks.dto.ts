import { TaskStatus } from '@prisma/client';

/* eslint-disable no-unused-vars */
export class GetTasksDto {
	private constructor(
		public readonly userId: string,
		public readonly boardId: string,
		public readonly status?: TaskStatus,
		public readonly isActive?: boolean,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(props: { [key: string]: any }): [string?, GetTasksDto?] {
		const { userId, boardId, status, isActive = true } = props;

		if (!userId) return ['Missing user ID.'];

		if (!boardId) return ['Missing board ID.'];

		let isActiveBoolean = isActive;

		if (typeof isActive !== 'boolean') {
			isActiveBoolean = isActive === 'true';
		}

		return [
			undefined,
			new GetTasksDto(
				userId.toString(),
				boardId.toString(),
				status,
				isActiveBoolean,
			),
		];
	}
}
