import { ReminderTime, TaskStatus } from '@prisma/client';

/* eslint-disable no-unused-vars */
export class UpdateTaskDto {
	private constructor(
		public readonly id: string,
		public readonly userId: string,
		public readonly title?: string,
		public readonly description?: string,
		public readonly status?: TaskStatus,
		public readonly labels?: string[],
		public readonly startDate?: Date,
		public readonly endDate?: Date,
		public readonly reminderTime?: ReminderTime,
		public readonly updatedAt?: Date,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(object: { [key: string]: any }): [string?, UpdateTaskDto?] {
		const {
			id,
			userId,
			title,
			description = '',
			status = TaskStatus.TODO,
			labels = [],
			startDate,
			endDate,
			reminderTime,
		} = object;

		if (!id) return ['Missing ID.'];

		if (title && title.length > 200) return ['Title is too long.'];

		if (!userId) return ['Missing user ID.'];

		if (!isNaN(Date.parse(startDate)) || !isNaN(Date.parse(endDate))) {
			return ["It's not a valid datetime."];
		}

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
				`It's not a valid status. Valid ones: ${[TaskStatus.TODO, TaskStatus.DONE, TaskStatus.DONE].toString()}`,
			];
		}

		const reminderTimes = [
			ReminderTime.NONE,
			ReminderTime.MINS_5,
			ReminderTime.MINS_10,
			ReminderTime.MINS_15,
			ReminderTime.MINS_30,
			ReminderTime.HOUR_1,
			ReminderTime.HOURS_2,
			ReminderTime.DAY_1,
			ReminderTime.DAYS_2,
		];

		if (reminderTime && !reminderTimes.includes(reminderTime)) {
			return [
				`It's not a valid reminder time. Valid times: ${reminderTimes.toString()}`,
			];
		}

		return [
			undefined,
			new UpdateTaskDto(
				id,
				userId,
				title,
				description,
				status,
				labelsIds,
				startDate,
				endDate,
				reminderTime,
				new Date(),
			),
		];
	}
}
