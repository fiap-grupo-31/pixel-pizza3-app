import { Customers } from '../entities';
import { DbConnection } from '../interfaces/dbconnection';
import { CustomersGatewayInterface } from '../interfaces/CustomersGatewayInterface';
import { ParametroBd } from '@types';

export class CustomersGateway implements CustomersGatewayInterface {
	private repositorioDados: DbConnection;
	private schema = 'customers';

	constructor(database: DbConnection) {
		this.repositorioDados = database;
	}

	async findId(id: string): Promise<Customers | null> {
		const result = await this.repositorioDados.findId(this.schema, id);

		if (result === null) {
			return null;
		} else {
			return new Customers(
				result.id,
				result.name,
				result.mail,
				result.cpf,
				result.birthdate,
				result.subscription,
				result.created_at,
				result.updated_at
			);
		}
	}

	async find(reference: Record<string, any>): Promise<Customers[] | null> {
		const result = await this.repositorioDados.find(this.schema, reference);

		if (result === null) {
			return null;
		} else {
			const returnData: Customers[] = [];
			result.forEach((element: any) => {
				returnData.push(
					new Customers(
						element.id,
						element.name,
						element.mail || '',
						element.cpf || '',
						element.birthdate || '',
						element.subscription || '',
						element.created_at,
						element.updated_at
					)
				);
			});
			return returnData;
		}
	}

	async findAll(): Promise<Customers[] | null> {
		const result = await this.repositorioDados.findAll(this.schema);

		if (result === null) {
			return null;
		} else {
			const returnData: Customers[] = [];
			result.forEach((element: any) => {
				returnData.push(
					new Customers(
						element.id,
						element.name,
						element.mail || '',
						element.cpf || '',
						element.birthdate || '',
						element.subscription || '',
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
		mail: string,
		cpf: string,
		birthdate: Date,
		subscription: string
	): Promise<any> {
		const customer = new Customers(
			'',
			name,
			mail,
			cpf,
			birthdate,
			subscription,
			null,
			null
		)

		const success = await this.repositorioDados.persist(
			this.schema,
			{
				name: customer.name,
				mail: customer.mail,
				cpf: customer.cpf,
				birthdate: customer.birthdate,
				subscription: customer.subscription
			}
		);

		return success;
	}

	async update(
		id: string,
		name: string,
		mail: string,
		cpf: string,
		birthdate: Date,
		subscription: string
	): Promise<any> {
		const parameters: ParametroBd[] = [];
		const customer = new Customers(
			'',
			name,
			mail,
			cpf,
			birthdate,
			subscription,
			null,
			null
		)

		const success = await this.repositorioDados.update(
			this.schema,
			id,
			{
				name: customer.name,
				mail: customer.mail,
				cpf: customer.cpf,
				birthdate: customer.birthdate,
				subscription: customer.subscription
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
