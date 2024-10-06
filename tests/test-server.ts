import { Server } from '../src/presentation/server';

export const testServer = new Server({
	port: Math.floor(Math.random() * (65535 - 1000 + 1) + 1000),
});
