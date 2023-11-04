import { ProductsImages } from '../entities';
import { DbConnection } from '../interfaces/dbconnection';
import { ProductsImagesGatewayInterface } from '../interfaces/ProductsImagesGatewayInterface';
import { ParametroBd } from '@types';
import { Global } from '../../interfaces/adapters';

export class ProductsImagesGateway implements ProductsImagesGatewayInterface {
	private repositorioDados: DbConnection;
	private schema = 'productsImages';

	constructor(database: DbConnection) {
		this.repositorioDados = database;
	}

	async findId(id: string): Promise<ProductsImages | null> {
		const result = await this.repositorioDados.findId(this.schema, id);

		if (result === null) {
			return null;
		} else {
			return new ProductsImages(
				result.id,
				result.productId,
				result.name,
				result.size,
				result.type,
				result.base64,
				result.created_at,
				result.updated_at
			);
		}
	}

	async find(
		reference: Record<string, any>
	): Promise<ProductsImages[] | null> {
		const result = await this.repositorioDados.find(this.schema, reference);

		if (result === null) {
			return null;
		} else {
			const returnData: ProductsImages[] = [];
			result.forEach((element: any) => {
				returnData.push(
					new ProductsImages(
						element.id,
						element.productId,
						element.name,
						element.size,
						element.type,
						element.base64,
						element.created_at,
						element.updated_at
					)
				);
			});
			return returnData;
		}
	}

	async findAll(): Promise<ProductsImages[] | null> {
		const result = await this.repositorioDados.findAll(this.schema);

		if (result === null) {
			return null;
		} else {
			const returnData: ProductsImages[] = [];
			result.forEach((element: any) => {
				returnData.push(
					new ProductsImages(
						element.id,
						element.productId,
						element.name,
						element.size,
						element.type,
						element.base64,
						element.created_at,
						element.updated_at
					)
				);
			});
			return returnData;
		}
	}

	async persist(
		productId: string,
		name: string,
		size: string,
		type: string,
		base64: string
	): Promise<any> {
		const produtcs = new ProductsImages(
			'',
			productId,
			name,
			size,
			type,
			base64,
			null,
			null
		)

		const success = await this.repositorioDados.persist(
			this.schema,
			{
				productId: produtcs.productId,
				name: produtcs.name,
				size: produtcs.size,
				type: produtcs.type,
				base64: produtcs.base64
			}
		);

		return success;
	}

	async update(
		id: string,
		name: string,
		size: string,
		type: string,
		base64: string
	): Promise<any> {
		const produtcs = new ProductsImages(
			'',
			'',
			name,
			size,
			type,
			base64,
			null,
			null
		)

		const success = await this.repositorioDados.update(
			this.schema,
			id,
			{
				name: produtcs.name,
				size: produtcs.size,
				type: produtcs.type,
				base64: produtcs.base64
			}
		);

		return success;
	}

	async remove(id: string): Promise<any | null> {
		const result = await this.repositorioDados.remove(this.schema, id);

		return result;
	}

	async isValidId(id: string): Promise<Boolean> {
		const result = await this.repositorioDados.isValidId(id);

		return result;
	}
}
