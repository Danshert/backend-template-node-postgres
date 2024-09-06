import { prisma } from '../../data/postgres';

import { LabelEntity } from '../../domain/entities';

import {
	CreateLabelDto,
	GetLabelDto,
	GetLabelsDto,
	UpdateLabelDto,
} from '../../domain/dtos/label';

import { CustomError } from '../../domain/errors';

export class LabelService {
	constructor() {}

	async getLabels(getLabelsDto: GetLabelsDto) {
		const { userId, boardId } = getLabelsDto;

		try {
			const labels = await prisma.label.findMany({
				where: { userId, boardId },
			});

			return [...labels.map((label) => LabelEntity.fromObject(label))];
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}

	async findById(id: string, userId: string) {
		const label = await prisma.label.findFirst({ where: { id } });

		if (!label) {
			throw CustomError.notFound(`Label with id ${id} not found.`);
		}

		if (label.userId.toString() !== userId) {
			throw CustomError.unauthorized(`You cannot access to this label.`);
		}

		return label;
	}

	async createLabel(createLabelDto: CreateLabelDto) {
		try {
			const labelExists = await prisma.label.findFirst({
				where: {
					name: createLabelDto.name,
					boardId: createLabelDto.boardId,
				},
			});

			if (labelExists) {
				throw CustomError.badRequest('Label already exists');
			}

			const label = await prisma.label.create({ data: createLabelDto });

			return LabelEntity.fromObject(label);
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}

	async updateLabel(updateLabelDto: UpdateLabelDto) {
		await this.findById(updateLabelDto.id, updateLabelDto.userId);

		try {
			const updatedLabel = await prisma.label.update({
				where: { id: updateLabelDto.id },
				data: updateLabelDto,
			});

			return LabelEntity.fromObject(updatedLabel);
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}

	async deleteLabel(getLabelDto: GetLabelDto) {
		await this.findById(getLabelDto.id, getLabelDto.userId);

		try {
			const deletedLabel = await prisma.label.delete({
				where: { id: getLabelDto.id },
			});

			return LabelEntity.fromObject(deletedLabel);
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}
}
