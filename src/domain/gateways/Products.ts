import { Products } from '../entities';
import { DbConnection } from '../interfaces/dbconnection';
import { ProductsGatewayInterface } from '../interfaces/ProductsGatewayInterface';
import { ParametroBd } from '@types';
import { Global } from '../../interfaces/adapters';

export class ProductsGateway implements ProductsGatewayInterface {
	private repositorioDados: DbConnection;
	private schema = 'products';

	constructor(database: DbConnection) {
		this.repositorioDados = database;
	}

	async findId(id: string): Promise<Products | null> {
		const result = await this.repositorioDados.findId(this.schema, id);

		if (result === null) {
			return null;
		} else {
			return new Products(
				result.id,
				result.name,
				result.price,
				result.category,
				result.description,
				result.created_at,
				result.updated_at
			);
		}
	}

	async find(reference: Record<string, any>): Promise<Products[] | null> {
		const result = await this.repositorioDados.find(this.schema, reference);

		if (result === null) {
			return null;
		} else {
			const returnData: Products[] = [];
			result.forEach((element: any) => {
				returnData.push(
					new Products(
						element.id,
						element.name,
						element.price,
						element.category,
						element.description,
						element.created_at,
						element.updated_at
					)
				);
			});
			return returnData;
		}
	}

	async findAll(): Promise<Products[] | null> {
		const result = await this.repositorioDados.findAll(this.schema);

		if (result === null) {
			return null;
		} else {
			const returnData: Products[] = [];
			result.forEach((element: any) => {
				returnData.push(
					new Products(
						element.id,
						element.name,
						element.price,
						element.category || 'ACCOMPANIMENT',
						element.description,
						element.created_at,
						element.updated_at
					)
				);
			});
			return returnData;
		}
	}

	async persist(
		name: string,
		price: number,
		category: string,
		description: string
	): Promise<any> {

		const produtcs = new Products(
			'',
			name,
			price,
			category,
			description,
			null,
			null
		)

		const success = await this.repositorioDados.persist(
			this.schema,
			{
				name: produtcs.name,
				price: produtcs.price,
				category: produtcs.category,
				description: produtcs.description
			}
		);

		return success;
	}

	async update(
		id: string,
		name: string,
		price: number,
		category: string,
		description: string
	): Promise<any> {

		const produtcs = new Products(
			id,
			name,
			price,
			category,
			description,
			null,
			null
		)

		const success = await this.repositorioDados.update(
			this.schema,
			id,
			{
				name: produtcs.name,
				price: produtcs.price,
				category: produtcs.category,
				description: produtcs.description
			}
		);

		return success;
	}

	async remove(id: string): Promise<any | null> {
		const result = await this.repositorioDados.remove(this.schema, id);

		return result;
	}
}
