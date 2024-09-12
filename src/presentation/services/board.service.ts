import { BoardEntity } from '../../domain/entities';

import { prisma } from '../../data/postgres';

import { PaginationDto } from '../../domain/dtos/shared';
import { GetBoardsDto } from '../../domain/dtos/board/get-boards.dto';

import {
	CreateBoardDto,
	GetBoardDto,
	UpdateBoardDto,
} from '../../domain/dtos/board';

import { CustomError } from '../../domain/errors';

export class BoardService {
	constructor() {}

	async getBoards(getBoardsDto: GetBoardsDto, paginationDto: PaginationDto) {
		const { userId, isActive } = getBoardsDto;
		const { page, limit } = paginationDto;

		try {
			const [total, boards] = await Promise.all([
				prisma.board.count({
					where: { userId, isActive },
				}),
				prisma.board.findMany({
					where: { userId, isActive },
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

	async findById(id: string, userId: string) {
		const board = await prisma.board.findFirst({ where: { id } });

		if (!board)
			throw CustomError.notFound(`Board with id ${id} not found.`);

		if (board.userId !== userId) {
			throw CustomError.unauthorized(`You cannot access to this board.`);
		}

		return board;
	}

	async getBoardById(getBoardDto: GetBoardDto) {
		const board = await this.findById(getBoardDto.id, getBoardDto.userId);

		return BoardEntity.fromObject(board);
	}

	async createBoard(createBoardDto: CreateBoardDto) {
		try {
			const board = await prisma.board.create({ data: createBoardDto });

			return BoardEntity.fromObject(board);
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}

	async updateBoard(updateBoardDto: UpdateBoardDto) {
		await this.findById(updateBoardDto.id, updateBoardDto.userId);

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

	async deleteBoard(getBoardDto: GetBoardDto) {
		await this.findById(getBoardDto.id, getBoardDto.userId);

		try {
			const deletedBoard = await prisma.board.delete({
				where: { id: getBoardDto.id },
			});

			return BoardEntity.fromObject(deletedBoard);
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}
}
