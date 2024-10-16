import { BufferOptions, TDocumentDefinitions } from 'pdfmake/interfaces';
import pdfMakePrinter from 'pdfmake';

const fonts = {
	Roboto: {
		normal: 'fonts/Roboto-Regular.ttf',
		bold: 'fonts/Roboto-Bold.ttf',
		italics: 'fonts/Roboto-Italic.ttf',
		bolditalics: 'fonts/Roboto-BoldItalic.ttf',
	},
};

export class PrinterService {
	// eslint-disable-next-line no-unused-vars
	constructor(private printer = new pdfMakePrinter(fonts)) {}

	createPdf(
		docDefinition: TDocumentDefinitions,
		options: BufferOptions = {},
	): PDFKit.PDFDocument {
		return this.printer.createPdfKitDocument(docDefinition, options);
	}
}
