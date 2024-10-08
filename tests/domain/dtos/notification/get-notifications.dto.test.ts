import { GetNotificationsDto } from '../../../../src/domain/dtos';

describe('Tests in get-notifications dto', () => {
	const dataObject = {
		userId: '66e28f9bf12cf45a9487a01c',
		boardId: '66e28f9bf12cf45a9487a01c',
		isActive: true,
	};

	test('should create a get-notifications dto instance', () => {
		const [error, getNotificationsDto] =
			GetNotificationsDto.create(dataObject);

		expect(error).toBe(undefined);
		expect(getNotificationsDto).toBeInstanceOf(GetNotificationsDto);
	});

	test('should validate if missing user id', () => {
		const [error, getNotificationsDto] = GetNotificationsDto.create({
			...dataObject,
			userId: null,
		});

		expect(error).toContain('Missing user ID');
		expect(getNotificationsDto).toBe(undefined);
	});

	test('should validate if missing board id', () => {
		const [error, getNotificationsDto] = GetNotificationsDto.create({
			...dataObject,
			boardId: null,
		});

		expect(error).toContain('Missing board ID');
		expect(getNotificationsDto).toBe(undefined);
	});

	test('should validate if isActive is boolean', () => {
		const [, getNotificationsDto] = GetNotificationsDto.create({
			...dataObject,
			seen: 'true',
		});

		expect(getNotificationsDto?.seen).toStrictEqual(expect.any(Boolean));
	});
});
