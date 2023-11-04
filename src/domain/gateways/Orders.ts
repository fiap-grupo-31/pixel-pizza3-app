import { Orders } from '../entities';
import { DbConnection } from '../interfaces/dbconnection';
import { OrdersGatewayInterface } from '../interfaces/OrdersGatewayInterface';
import { ParametroBd } from '@types';

export class OrdersGateway implements OrdersGatewayInterface {
	private repositorioDados: DbConnection;
	private schema = 'orders';

	constructor(database: DbConnection) {
		this.repositorioDados = database;
	}

	async findId(id: string): Promise<Orders | null> {
		const result = await this.repositorioDados.findId(this.schema, id);

		if (result === null) {
			return null;
		} else {
			return new Orders(
				result.id,
				result.protocol,
				result.customerId,
				result.amount,
				result.quantity,
				result.status,
				result.payment,
				result.created_at,
				result.updated_at
			);
		}
	}

	async find(reference: Record<string, any>): Promise<Orders[] | null> {
		const result = await this.repositorioDados.find(this.schema, reference);

		if (result === null) {
			return null;
		} else {
			const returnData: Orders[] = [];
			result.forEach((element: any) => {
				returnData.push(
					new Orders(
						element.id,
						element.protocol,
						element.customerId,
						element.amount,
						element.quantity,
						element.status,
						element.payment,
						element.created_at,
						element.updated_at
					)
				);
			});
			return returnData;
		}
	}

	async findAll(): Promise<Orders[] | null> {
		const result = await this.repositorioDados.findAll(this.schema);

		if (result === null) {
			return null;
		} else {
			const returnData: Orders[] = [];
			result.forEach((element: any) => {
				returnData.push(
					new Orders(
						element.id,
						element.protocol,
						element.customerId,
						element.amount,
						element.quantity,
						element.status,
						element.payment,
						element.created_at,
						element.updated_at
					)
				);
			});
			return returnData;
		}
	}

	async persist(
		customerId: string,
		quantity: number,
		amount: number,
		status: string,
		payment: string | null
	): Promise<any> {
		const orders = new Orders(
			'',
			0,
			customerId,
			amount,
			quantity,
			status,
			payment,
			null,
			null
		)

		let objectPersist: Object | any = {
			status: orders.status,
			payment: orders.payment,
			quantity: orders.quantity,
			amount: orders.amount,
		}

		if(orders.customerId != '')
			objectPersist['customerId'] = orders.customerId;

		const success = await this.repositorioDados.persist(
			this.schema,
			objectPersist
		);

		return success;
	}

	async update(
		id: string,
		customerId: string,
		quantity: number,
		amount: number,
		status: string,
		payment: string | null
	): Promise<any> {
		const orders = new Orders(
			'',
			0,
			customerId,
			amount,
			quantity,
			status,
			payment,
			null,
			null
		)

		let objectPersist: Object | any = {
			status: orders.status,
			payment: orders.payment,
		}

		if(orders.customerId != '')
			objectPersist['customerId'] = orders.customerId;

		const success = await this.repositorioDados.update(
			this.schema,
			id,
			objectPersist
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
