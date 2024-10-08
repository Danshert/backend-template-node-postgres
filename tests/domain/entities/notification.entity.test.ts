import { NotificationEntity } from '../../../src/domain/entities';

describe('Tests in notification entity', () => {
	const dataObject = {
		id: 'ABC',
		message: 'Test',
		seen: false,
		createdAt: new Date(),
	};

	test('should create a notification entity instance', () => {
		const notification = NotificationEntity.fromObject(dataObject);

		expect(notification).toBeInstanceOf(NotificationEntity);
		expect(notification.id).toBe(dataObject.id);
		expect(notification.message).toBe(dataObject.message);
		expect(notification.seen).toBe(dataObject.seen);
		expect(notification.createdAt).toBe(dataObject.createdAt);
	});

	test('should validate if missing id', () => {
		try {
			NotificationEntity.fromObject({
				...dataObject,
				id: null,
			});
		} catch (error) {
			const errorString = `${error}`;
			expect(errorString).toContain('Error: Missing id');
		}
	});

	test('should validate if missing message', () => {
		try {
			NotificationEntity.fromObject({
				...dataObject,
				message: null,
			});
		} catch (error) {
			const errorString = `${error}`;
			expect(errorString).toContain('Error: Missing message');
		}
	});
});
