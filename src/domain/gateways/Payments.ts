import { Payments } from '../entities';
import { DbConnection } from '../interfaces/dbconnection';
import { PaymentsGatewayInterface } from '../interfaces/PaymentsGatewayInterface';
import { ParametroBd } from '@types';

export class PaymentsGateway implements PaymentsGatewayInterface {
	private repositorioDados: DbConnection;
	private schema = 'payments';

	constructor(database: DbConnection) {
		this.repositorioDados = database;
	}

	async findId(id: string): Promise<Payments | null> {
		const result = await this.repositorioDados.findId(this.schema, id);

		if (result === null) {
			return null;
		} else {
			return new Payments(
				result.id,
				result.orderId,
				result.broker,
				result.status,
				result.description,
				result.created_at,
				result.updated_at
			);
		}
	}

	async find(reference: Record<string, any>): Promise<Payments[] | null> {
		const result = await this.repositorioDados.find(this.schema, reference);

		if (result === null) {
			return null;
		} else {
			const returnData: Payments[] = [];
			result.forEach((element: any) => {
				returnData.push(
					new Payments(
						element.id,
						element.orderId,
						element.broker,
						element.status,
						element.description,
						element.created_at,
						element.updated_at
					)
				);
			});
			return returnData;
		}
	}

	async findAll(): Promise<Payments[] | null> {
		const result = await this.repositorioDados.findAll(this.schema);

		if (result === null) {
			return null;
		} else {
			const returnData: Payments[] = [];
			result.forEach((element: any) => {
				returnData.push(
					new Payments(
						element.id,
						element.orderId,
						element.broker,
						element.status,
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
		orderId: string,
		broker: string,
		status: string,
		description: string
	): Promise<any> {

		const payments = new Payments(
			'',
			orderId,
			broker,
			status,
			description,
			null,
			null
		)

		const success = await this.repositorioDados.persist(
			this.schema,
			{
				orderId: payments.orderId,
				broker: payments.broker,
				status: payments.status,
				description: payments.description
			}
		);

		return success;
	}

	async update(
		id: string,
		orderId: string,
		broker: string,
		status: string,
		description: string
	): Promise<any> {

		const payments = new Payments(
			id,
			orderId,
			broker,
			status,
			description,
			null,
			null
		)

		const success = await this.repositorioDados.update(
			this.schema,
			id,
			{
				orderId: payments.orderId,
				broker: payments.broker,
				status: payments.status,
				description: payments.description
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
