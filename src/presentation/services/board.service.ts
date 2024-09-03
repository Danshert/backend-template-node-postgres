import { BoardEntity, UserEntity } from '../../domain/entities';

import { prisma } from '../../data/postgres';

import { PaginationDto } from '../../domain/dtos/shared';
import { GetBoardsdDto } from '../../domain/dtos/board/get-boards.dto';
import { CreateBoardDto, UpdateBoardDto } from '../../domain/dtos/board';

import { CustomError } from '../../domain/errors';

export class BoardService {
	constructor() {}

	async getBoards(
		user: UserEntity,
		getBoardsdDto: GetBoardsdDto,
		paginationDto: PaginationDto,
	) {
		const { isActive } = getBoardsdDto;
		const { page, limit } = paginationDto;

		try {
			const [total, boards] = await Promise.all([
				prisma.board.count({
					where: { userId: user.id, isActive },
				}),
				prisma.board.findMany({
					where: { userId: user.id, isActive },
					skip: (page - 1) * limit,
					take: limit,
				}),
			]);

			return {
				page,
				lastPage: Math.ceil(total / limit) || 1,
				limit,
				total,
				prev:
					page > 1
						? `/api/boards?page=${page - 1}&limit=${limit}`
						: null,
				next:
					page < Math.ceil(total / limit)
						? `/api/boards?page=${page + 1}&limit=${limit}`
						: null,
				boards: boards.map((board) => BoardEntity.fromObject(board)),
			};
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}

	async findById(id: string, user: UserEntity) {
		const board = await prisma.board.findFirst({ where: { id } });

		if (!board)
			throw CustomError.notFound(`Board with id ${id} not found.`);

		if (board.userId !== user.id) {
			throw CustomError.unauthorized(`You cannot access to this board.`);
		}

		return board;
	}

	async getBoardById(id: string, user: UserEntity) {
		const board = await this.findById(id, user);

		return BoardEntity.fromObject(board);
	}

	async createBoard(createBoardDto: CreateBoardDto, user: UserEntity) {
		try {
			const board = await prisma.board.create({
				data: { ...createBoardDto, userId: user.id },
			});

			return BoardEntity.fromObject(board);
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}

	async updateBoard(updateBoardDto: UpdateBoardDto, user: UserEntity) {
		await this.findById(updateBoardDto.id, user);

		try {
			const updatedBoard = await prisma.board.update({
				where: { id: updateBoardDto.id },
				data: updateBoardDto,
			});

			return BoardEntity.fromObject(updatedBoard);
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}

	async delateBoard(id: string, user: UserEntity) {
		await this.findById(id, user);

		try {
			const deletedBoard = await prisma.board.delete({ where: { id } });

			return BoardEntity.fromObject(deletedBoard);
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}
}
