import { Request, Response } from 'express';

import { BoardService } from '../services/';

import {
	CreateBoardDto,
	GetBoardsdDto,
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
		const [error, getBoardsDto] = GetBoardsdDto.create({
			...request.query,
			...request.body,
		});

		const [errorPagination, paginationDto] = PaginationDto.create({
			...request.query,
			...request.body,
		});

		if (error || errorPagination)
			return response.status(400).json({ error });

		this.boardService
			.getBoards(request.body.user, getBoardsDto!, paginationDto!)
			.then((boards) => response.status(201).json(boards))
			.catch((error) => this.handleError(error, response));
	};

	getBoardById = (request: Request, response: Response) => {
		const id = request.params.id;

		this.boardService
			.getBoardById(id, request.body.user)
			.then((board) => response.status(200).json(board))
			.catch((error) => this.handleError(error, response));
	};

	createBoard = (request: Request, response: Response) => {
		const [error, createBoardDto] = CreateBoardDto.create({
			...request.query,
			...request.body,
		});

		if (error) return response.status(400).json({ error });

		this.boardService
			.createBoard(createBoardDto!, request.body.user)
			.then((board) => response.status(201).json(board))
			.catch((error) => this.handleError(error, response));
	};

	updateBoard = (request: Request, response: Response) => {
		const id = request.params.id;

		const [error, updateBoardDto] = UpdateBoardDto.create({
			...request.query,
			...request.body,
			id,
		});

		if (error) return response.status(400).json({ error });

		this.boardService
			.updateBoard(updateBoardDto!, request.body.user)
			.then((board) => response.status(200).json(board))
			.catch((error) => this.handleError(error, response));
	};

	deleteBoard = (request: Request, response: Response) => {
		const id = request.params.id;

		if (!id) return response.status(400).json({ error: 'Missing id' });

		this.boardService
			.delateBoard(id, request.body.user)
			.then((board) => response.status(200).json(board))
			.catch((error) => this.handleError(error, response));
	};
}
