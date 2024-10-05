import { Request, Response } from 'express';

import { BoardService } from '../services/';

import {
	CreateBoardDto,
	GetBoardDto,
	GetBoardsDto,
	UpdateBoardDto,
} from '../../domain/dtos/';

import { PaginationDto } from '../../domain/dtos/shared';

import { CustomError } from '../../domain/errors';

export class BoardController {
	// eslint-disable-next-line no-unused-vars
	constructor(private readonly boardService: BoardService) {}

	private handleError = (error: unknown, response: Response) => {
		if (error instanceof CustomError) {
			return response
				.status(error.statusCode)
				.json({ error: error.message });
		}

		console.log(`${error}`);
		return response.status(500).json({ error: 'Internal server error' });
	};

	getBoards = async (request: Request, response: Response) => {
		console.log(response);

		const [error, getBoardsDto] = GetBoardsDto.create({
			...request.query,
			...request.body,
			userId: request.body.user.id,
		});

		const [errorPagination, paginationDto] = PaginationDto.create({
			...request.query,
			...request.body,
		});

		if (error || errorPagination)
			return response.status(400).json({ error });

		this.boardService
			.getBoards(getBoardsDto!, paginationDto!)
			.then((boards) => response.status(200).json(boards))
			.catch((error) => this.handleError(error, response));
	};

	getBoardById = (request: Request, response: Response) => {
		const id = request.params.id;

		const [error, getBoardDto] = GetBoardDto.create({
			id,
			userId: request.body.user.id,
		});

		if (error) return response.status(400).json({ error });

		this.boardService
			.getBoardById(getBoardDto!)
			.then((board) => response.status(200).json(board))
			.catch((error) => this.handleError(error, response));
	};

	createBoard = (request: Request, response: Response) => {
		const [error, createBoardDto] = CreateBoardDto.create({
			userId: request.body.user.id,
			...request.query,
			...request.body,
		});

		if (error) return response.status(400).json({ error });

		this.boardService
			.createBoard(createBoardDto!)
			.then((board) => response.status(201).json(board))
			.catch((error) => this.handleError(error, response));
	};

	updateBoard = (request: Request, response: Response) => {
		const id = request.params.id;

		const [error, updateBoardDto] = UpdateBoardDto.create({
			id,
			userId: request.body.user.id,
			...request.query,
			...request.body,
		});

		if (error) return response.status(400).json({ error });

		this.boardService
			.updateBoard(updateBoardDto!)
			.then((board) => response.status(200).json(board))
			.catch((error) => this.handleError(error, response));
	};

	deleteBoard = (request: Request, response: Response) => {
		const id = request.params.id;

		const [error, getBoardDto] = GetBoardDto.create({
			id,
			userId: request.body.user.id,
		});

		if (error) return response.status(400).json({ error });

		this.boardService
			.deleteBoard(getBoardDto!)
			.then((board) => response.status(200).json(board))
			.catch((error) => this.handleError(error, response));
	};
}
