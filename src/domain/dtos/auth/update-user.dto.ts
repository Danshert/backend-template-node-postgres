/* eslint-disable no-unused-vars */

import { UploadedFile } from 'express-fileupload';

export class UpdateUserDto {
	constructor(
		public id: string,
		public name?: string,
		public emailNotifications?: boolean,
		public imageFile?: UploadedFile,
		public password?: string,
		public updatedAt?: Date,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static create(object: { [key: string]: any }): [string?, UpdateUserDto?] {
		const {
			id,
			name,
			emailNotifications = false,
			password,
			image,
		} = object;

		if (!id) return ['Missing id.'];

		if (!name) return ['Missing name.'];
		if (name.length > 200) return ['Name is too long.'];

		if (password && password.length < 6) return ['Password is too short.'];
		if (password && password.length > 100) return ['Password is too long.'];

		let emailNotificationsBoolean = emailNotifications;

		if (typeof emailNotifications !== 'boolean') {
			emailNotificationsBoolean = emailNotifications === 'true';
		}

		if (image) {
			const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];
			const fileExtension = image.mimetype.split('/').at(1) ?? '';

			if (!validExtensions.includes(fileExtension)) {
				return [
					`Invalid extension: ${fileExtension}, valid ones ${validExtensions}`,
				];
			}

			const imageSizeInMb = image.size / 1024 / 1024;

			if (imageSizeInMb > 10) {
				return [`File size is too large. Maximum allowed: 10 mb.`];
			}
		}

		return [
			undefined,
			new UpdateUserDto(
				id,
				name,
				emailNotificationsBoolean,
				image,
				password,
				new Date(),
			),
		];
	}
}
