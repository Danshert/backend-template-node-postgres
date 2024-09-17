import { Server } from '../src/presentation/server';
import { AppRoutes } from '../src/presentation/routes';

export const testServer = new Server({
	port: Math.floor(Math.random() * (9999 - 1000 + 1) + 1000),
	routes: AppRoutes.routes,
});
