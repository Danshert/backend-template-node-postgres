import { Content } from 'pdfmake/interfaces';

import { DateFormatter } from '../../config';

interface Options {
	title?: string;
	subtitle?: string;
	showLogo?: boolean;
	showDate?: boolean;
}

const logo: Content = {
	image: 'src/assets/nodejs.png',
	width: 40,
	height: 40,
};

const currentDate: Content = {
	text: DateFormatter.getDDMMYYYY(new Date()),
	alignment: 'right',
	fontSize: 11,
	marginTop: 12,
};

export const headerSection = (options: Options): Content => {
	const {
		title = 'Tareas App',
		subtitle,
		showLogo = true,
		showDate = true,
	} = options;

	const headerLogo: Content = showLogo ? logo : '';
	const headerDate: Content = showDate ? currentDate : '';

	const headerSubtitle: Content = subtitle
		? {
				text: subtitle,
				marginTop: 2,
				marginLeft: 8,
				style: { fontSize: 14 },
			}
		: '';

	const headerTitle: Content = title
		? {
				stack: [
					{
						text: title,
						marginTop: subtitle ? 0 : 8,
						marginLeft: 8,
						style: { fontSize: 16, bold: true },
					},
					headerSubtitle,
				],
			}
		: '';

	return [
		{
			columns: [headerLogo, headerTitle, headerDate],
			margin: [40, 30, 40, 8],
		},
		{
			canvas: [
				{
					type: 'line',
					x1: 40,
					y1: 0,
					x2: 553,
					y2: 0,
					lineWidth: 1,
				},
			],
		},
	];
};
