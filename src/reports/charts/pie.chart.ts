import { chartJsToImage } from '../../config';

interface PieEntry {
	label: string;
	value: number;
	color?: string;
}

interface PieOptions {
	entries: PieEntry[];
	position?: 'left' | 'right' | 'top' | 'bottom';
}

export const generatePieChart = async (options: PieOptions) => {
	const { entries, position } = options;

	const data = {
		labels: entries.map((e) => e.label),
		datasets: [
			{
				label: 'Dataset 1',
				data: entries.map((e) => e.value),
				backgroundColor: entries.map((e) => e.color),
				font: 20,
			},
		],
	};

	const config = {
		type: 'pie',
		data: data,
		options: {
			legend: { position },
			plugins: {
				labels: {
					font: { weight: 'bold', size: 20 },
				},
				datalabels: {
					color: 'white',
					font: {
						weight: 'bold',
						size: 14,
					},
				},
			},
		},
	};

	return chartJsToImage(config);
};
