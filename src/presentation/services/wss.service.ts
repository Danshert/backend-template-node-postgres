import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { JwtAdapter } from '../../config';

interface Options {
	server: Server;
	path?: string;
}

interface WebSocketClient {
	id: string;
	wsClient: WebSocket;
}

interface Payload {
	userId: string;
	[key: string]: string | number | boolean | Date | object | null | undefined;
}

export class WssService {
	private static _instance: WssService;
	private wss: WebSocketServer;
	private wssClients: WebSocketClient[];

	private constructor(options: Options) {
		const { server, path = '/ws' } = options;

		this.wss = new WebSocketServer({ server, path });
		this.wssClients = [];
		this.start();
	}

	static get instance(): WssService {
		if (!WssService._instance) {
			throw 'WssService is not initialized';
		}

		return WssService._instance;
	}

	static initWss(options: Options) {
		WssService._instance = new WssService(options);
	}

	public sendMessage(type: string, { userId, ...payload }: Payload) {
		this.wssClients.forEach((client) => {
			if (client.id === userId) {
				if (client.wsClient.readyState === WebSocket.OPEN) {
					client.wsClient.send(JSON.stringify({ type, payload }));
				}
			}
		});
	}

	public start() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.wss.on('connection', async (ws: WebSocket, request: any) => {
			const token = request.headers.token;

			const payload = await JwtAdapter.validateToken<{ id: string }>(
				token,
			);

			if (!payload) {
				ws.close();
				return;
			}

			this.wss.clients.forEach((client) => {
				if (!this.wssClients.find((c) => c.id === payload.id)) {
					this.wssClients.push({ id: payload.id, wsClient: client });
				}
			});

			ws.on('close', async () => {
				const token = request.headers.token;

				const payload = await JwtAdapter.validateToken<{ id: string }>(
					token,
				);

				this.wssClients = this.wssClients.filter(
					(c) => c.id !== payload!.id,
				);

				ws.close();
			});
		});
	}
}
