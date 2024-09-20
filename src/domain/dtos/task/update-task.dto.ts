import { TaskStatus } from '@prisma/client';

/* eslint-disable no-unused-vars */
export class UpdateTaskDto {
	private constructor(
		public readonly id: string,
		public readonly title: string,
		public readonly userId: string,
		public readonly description: string,
		public readonly status: TaskStatus,
		public readonly labels: string[],
		public readonly updatedAt: Date,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(object: { [key: string]: any }): [string?, UpdateTaskDto?] {
		const {
			id,
			title,
			userId,
			description = '',
			status = TaskStatus.TODO,
			labels = [],
		} = object;

		if (!id) return ['Missing ID.'];

		if (!title) return ['Missing title.'];
		if (title.length > 200) return ['Title is too long.'];

		if (!userId) return ['Missing user ID.'];

		if (typeof labels !== 'object') {
			return ['Labels must be an array of label IDs.'];
		}

		const labelsIds: string[] = [];

		if (labels.length > 0 && typeof labels[0] === 'object') {
			labels.forEach((label: { labelId: string; taskId: string }) => {
				if (!labelsIds.includes(label.labelId)) {
					labelsIds.push(label.labelId);
				}
			});
		} else {
			labels.forEach((label: string) => {
				if (!labelsIds.includes(label)) {
					labelsIds.push(label);
				}
			});
		}

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
			new UpdateTaskDto(
				id,
				title,
				userId,
				description,
				status,
				labelsIds,
				new Date(),
			),
		];
	}
}
