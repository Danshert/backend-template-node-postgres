import { footerSection } from '../../../src/reports/sections';

describe('Tests in footer report section', () => {
	test('should return a footer report section', () => {
		const currentPage = 1;
		const pageCount = 1;

		const footer = footerSection(currentPage, pageCount) as {
			text: string;
			alignment: 'center';
			fontSize: number;
		};

		expect(footer.text).toBe(`${currentPage} de ${pageCount}`);
		expect(footer.alignment).toBe('center');
		expect(footer.fontSize).toBe(10);
	});
});
