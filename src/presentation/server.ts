import express, { Router } from 'express';
import path from 'path';
import cors from 'cors';

import compression from 'compression';
import fileUpload from 'express-fileupload';

import { envs } from '../config';

import { CronService } from './cron/cron-service';
import { EmailService, NotificationService } from './services';

interface Options {
	port: number;
	public_path?: string;
}

export class Server {
	public readonly app = express();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private serverListener?: any;
	private readonly port: number;
	private readonly publicPath: string;

	constructor(options: Options) {
		const { port, public_path = 'public' } = options;
		this.port = port;
		this.publicPath = public_path;
		this.configure();
	}

	private configure() {
		// CORS
		this.app.use(cors());

		//* Middlewares
		this.app.use(express.json()); // raw
		this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
		this.app.use(compression());

		this.app.use(
			fileUpload({
				limits: { fileSize: 50 * 1024 * 1024 },
			}),
		);

		//* Public Folder
		this.app.use(express.static(this.publicPath));

		//* SPA
		this.app.get('*', (request, response) => {
			const indexPath = path.join(
				// eslint-disable-next-line no-undef
				__dirname + `../../../${this.publicPath}/index.html`,
			);
			response.sendFile(indexPath);
		});

		// Each 2 minutes
		CronService.createJob('0 */2 * * * *', () => {
			new NotificationService(
				new EmailService(
					envs.MAILER_SERVICE,
					envs.MAILER_EMAIL,
					envs.MAILER_SECRET_KEY,
					envs.SEND_EMAIL,
				),
			).checkDueDatesOfTasks();
		});
	}

	public setRoutes(router: Router) {
		this.app.use(router);
	}

	async start() {
		this.serverListener = this.app.listen(this.port, () => {
			console.log(`Server running on port ${this.port}`);
		});
	}

	public close() {
		this.serverListener?.close();
	}
}
