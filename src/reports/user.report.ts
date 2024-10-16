import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';

import { DateFormatter, NAMED_COLORS } from '../config';

import { generatePieChart } from './charts';
import { footerSection, headerSection } from './sections';

interface ReportValues {
	user: {
		name: string;
		email: string;
		registrationDate: Date;
	};
	boards: {
		amount: number;
	};
	tasks: {
		created: number;
		pending: number;
		inProgress: number;
		completed: number;
	};
}

const styles: StyleDictionary = {
	title: {
		fontSize: 16,
		bold: true,
		alignment: 'center',
		marginBottom: 30,
	},
	subtitle: {
		bold: true,
		fontSize: 14,
		marginBottom: 10,
	},
	p: {
		fontSize: 12,
		marginBottom: 3,
	},
};

export const getUserReport = async (values: ReportValues) => {
	const { user, boards, tasks } = values;

	const chart = await generatePieChart({
		entries: [
			{
				label: 'Pendientes',
				value: tasks.pending,
				color: NAMED_COLORS.red,
			},
			{
				label: 'En curso',
				value: tasks.inProgress,
				color: NAMED_COLORS.blue,
			},
			{
				label: 'Completadas',
				value: tasks.completed,
				color: NAMED_COLORS.green,
			},
		],

		position: 'bottom',
	});

	const documentDefinition: TDocumentDefinitions = {
		styles: styles,
		pageMargins: [40, 100, 40, 40],
		header: headerSection({
			title: 'Reporte de usuario',
			subtitle: 'Resumen de datos',
		}),
		footer: function (currentPage, pageCount) {
			return footerSection(currentPage, pageCount);
		},

		content: [
			{
				text: 'Información del usuario',
				style: 'subtitle',
			},
			{ text: `Nombre: ${user.name}`, style: 'p' },
			{ text: `Correo: ${user.email}`, style: 'p' },
			{
				text: `Fecha de registro: ${DateFormatter.getDDMMYYYY(user.registrationDate)}`,
				style: 'p',
				marginBottom: 20,
			},
			{
				text: 'Resumen de trabajo',
				style: 'subtitle',
				marginBottom: 20,
			},
			{
				columns: [
					{
						stack: [
							{
								text: 'Tareas creadas',
								alignment: 'center',
								fontSize: 12,
								marginBottom: 10,
							},
							{ image: chart, width: 350 },
						],
					},
					{
						stack: [
							{
								table: {
									headerRows: 1,
									widths: [100, 'auto'],
									body: [
										[
											{ text: 'Estatus', bold: true },
											{ text: 'Tareas', bold: true },
										],
										[
											'Pendientes',
											{
												text: tasks.pending,
												alignment: 'center',
											},
										],
										[
											'En curso',
											{
												text: tasks.inProgress,
												alignment: 'center',
											},
										],
										[
											'Completadas',
											{
												text: tasks.completed,
												alignment: 'center',
											},
										],
										[
											'Total',
											{
												text: tasks.created,
												alignment: 'center',
											},
										],
									],
								},
								layout: 'lightHorizontalLines',
								marginTop: 30,
							},
							{
								text: `${boards.amount} tableros creados`,
								fontSize: 12,
								marginTop: 10,
								bold: true,
							},
						],
					},
				],
			},
		],
	};

	return documentDefinition;
};
