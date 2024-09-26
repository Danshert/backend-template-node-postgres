/* eslint-disable no-unused-vars */

export class GetNotificationsDto {
	private constructor(
		public userId: string,
		public boardId: string,
		public seen?: boolean | null,
	) {}

	static create(props: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	}): [string?, GetNotificationsDto?] {
		const { userId, boardId, seen } = props;

		if (!userId) return ['Missing user ID.'];
		if (!boardId) return ['Missing board ID.'];

		let seenBoolean;

		if (seen === 'true') seenBoolean = true;
		else if (seen) seenBoolean = false;
		else seenBoolean = null;

		return [
			undefined,
			new GetNotificationsDto(
				userId.toString(),
				boardId.toString(),
				seenBoolean,
			),
		];
	}
}
