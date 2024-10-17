import { DateFormatter } from '../../../src/config';
import { headerSection } from '../../../src/reports/sections';

type Header = [
	{
		columns: [
			{ image: string; width: number; height: number },
			{
				stack: [
					{
						text: string;
						style: { fontSize: number; bold: number };
					},
					{
						text: string;
						style: { fontSize: number };
					},
				];
			},
			{ text: string; alignment: string; fontSize: number },
		];
	},
	{ canvas: [] },
];

describe('Tests in header report section', () => {
	test('should show title ', () => {
		const title = 'Titulo';

		const header = headerSection({ title }) as Header;

		expect(header[0].columns[1].stack[0].text).toBe(title);
	});

	test('should show subtitle ', () => {
		const title = 'Titulo';
		const subtitle = 'Subtitulo';

		const header = headerSection({ title, subtitle }) as Header;

		expect(header[0].columns[1].stack[1].text).toBe(subtitle);
	});

	test('should show logo', () => {
		const header = headerSection({}) as Header;

		expect(typeof header[0].columns[0].image).toBe('string');
	});

	test('should show current Date ', () => {
		const header = headerSection({}) as Header;

		expect(header[0].columns[2].text).toBe(
			DateFormatter.getDDMMYYYY(new Date()),
		);
	});
});
