import swaggerJSDocs, { Options } from 'swagger-jsdoc';
import path from 'path';

const options: Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'TODO API Documentation',
			version: '1.0.0',
		},
	},
	// eslint-disable-next-line no-undef
	apis: [`${path.join(__dirname, '**/routes.*')}`],
};

export const swaggerSpec = swaggerJSDocs(options);
