import { PrinterService } from './printer.service';

import { CustomError } from '../../domain';

import { getUserReport } from '../../reports/user.report';
import { prisma } from '../../data/postgres';
import { TaskStatus } from '@prisma/client';

export class ReportService {
	// eslint-disable-next-line no-unused-vars
	constructor(private readonly printerService: PrinterService) {}

	async generateUserReport(userId: string) {
		const user = await prisma.user.findFirst({ where: { id: userId } });

		if (!user) {
			throw CustomError.notFound(`User with ID:${userId} not found.`);
		}

		const [numberBoardCreated, statusTask] = await Promise.all([
			prisma.board.count({ where: { userId, isActive: true } }),
			prisma.task.groupBy({
				by: ['status'],
				_count: true,
				orderBy: { _count: { status: 'desc' } },
			}),
		]);

		console.log(statusTask);

		const pendingTask =
			statusTask.find((s) => s.status === TaskStatus.TODO)?._count || 0;

		const inProgresTask =
			statusTask.find((s) => s.status === TaskStatus.DOING)?._count || 0;

		const completedTask =
			statusTask.find((s) => s.status === TaskStatus.DONE)?._count || 0;

		const createdTasks = pendingTask + inProgresTask + completedTask;

		const documentDefinition = getUserReport({
			user: {
				name: user.name,
				email: user.email,
				registrationDate: user.createdAt,
			},
			boards: {
				amount: numberBoardCreated,
			},
			tasks: {
				created: createdTasks,
				pending: pendingTask,
				inProgress: inProgresTask,
				completed: completedTask,
			},
		});

		const document = this.printerService.createPdf(
			await documentDefinition,
		);

		return document;
	}
}
