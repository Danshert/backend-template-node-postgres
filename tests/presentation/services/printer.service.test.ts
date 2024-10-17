import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { PrinterService } from '../../../src/presentation/services';

describe('Tests in printer service', () => {
	test('should return a pdf created by pdf make', async () => {
		const printerService = new PrinterService();

		const documentDefinition: TDocumentDefinitions = { content: [] };

		const pdf = printerService.createPdf(documentDefinition);

		expect(pdf.info.Producer).toBe('pdfmake');
	});
});
