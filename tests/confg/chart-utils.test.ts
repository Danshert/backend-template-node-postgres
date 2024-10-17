import {
	months,
	NAMED_COLORS,
	numbers,
	rand,
	srand,
	transparentize,
} from '../../src/config';

describe('Tests in chart utils', () => {
	test('should randomize number', () => {
		const number = rand();

		expect(typeof number).toBe('number');
	});

	test('should transparentize color', () => {
		const transparentizeColor = transparentize(NAMED_COLORS.blue, 1);

		expect(typeof transparentizeColor).toBe('string');
	});

	test('should get monts', () => {
		const monthsArray = months();

		expect(typeof monthsArray).toBe('object');
		expect(monthsArray.length).toBe(12);
	});

	test('should get randomize numbers', () => {
		const randomizeNumbers = numbers();
		expect(typeof randomizeNumbers).toBe('object');
	});

	test('should retruns seed', () => {
		const seed = srand('ABC');
		expect(typeof seed).toBe('undefined');
	});
});
