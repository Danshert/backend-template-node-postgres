import express, { Router } from 'express';
import path from 'path';
import cors from 'cors';
import compression from 'compression';

interface Options {
	port: number;
	routes: Router;
	public_path?: string;
}

export class Server {
	public readonly app = express();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private serverListener?: any;
	private readonly port: number;
	private readonly publicPath: string;
	private readonly routes: Router;

	constructor(options: Options) {
		const { port, routes, public_path = 'public' } = options;
		this.port = port;
		this.publicPath = public_path;
		this.routes = routes;
	}

	async start() {
		// CORS
		this.app.use(cors());

		//* Middlewares
		this.app.use(express.json()); // raw
		this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
		this.app.use(compression());

		//* Public Folder
		this.app.use(express.static(this.publicPath));

		//* Routes
		this.app.use(this.routes);

		//* SPA
		this.app.get('*', (request, response) => {
			const indexPath = path.join(
				// eslint-disable-next-line no-undef
				__dirname + `../../../${this.publicPath}/index.html`,
			);
			response.sendFile(indexPath);
		});

		this.serverListener = this.app.listen(this.port, () => {
			console.log(`Server running on port ${this.port}`);
		});
	}

	public close() {
		this.serverListener?.close();
	}
}
