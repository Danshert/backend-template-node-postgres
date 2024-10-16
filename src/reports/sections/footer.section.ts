import { Content } from 'pdfmake/interfaces';

export const footerSection = (
	currentPage: number,
	pageCount: number,
): Content => {
	return {
		text: `${currentPage} de ${pageCount}`,
		alignment: 'center',
		fontSize: 10,
	};
};
