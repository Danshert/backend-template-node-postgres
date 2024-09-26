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
		public readonly reminderTime?: string,
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

		if (title.length > 200) return ['Title is too long.'];

		if (!userId) return ['Missing user ID.'];

		if (!isNaN(startDate) || !isNaN(endDate)) {
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

		const taskStatus = [TaskStatus.TODO, TaskStatus.DONE, TaskStatus.DONE];

		if (!taskStatus.includes(status)) {
			return [
				`It's not a valid status. Valid ones: ${taskStatus.toString()}`,
			];
		}

		const reminderTimes = [
			ReminderTime.NONE,
			ReminderTime.FIVE_MINS,
			ReminderTime.TEN_MINS,
			ReminderTime.FIFTEEN_MINS,
			ReminderTime.THIRTY_MINS,
			ReminderTime.ONE_HOUR,
			ReminderTime.TWO_HOURS,
			ReminderTime.ONE_DAY,
			ReminderTime.TWO_DAYS,
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
