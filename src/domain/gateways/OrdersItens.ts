import { OrdersItens } from '../entities';
import { DbConnection } from '../interfaces/dbconnection';
import { OrdersItensGatewayInterface } from '../interfaces/OrdersItensGatewayInterface';
import { ParametroBd } from '@types';

export class OrdersItemsGateway implements OrdersItensGatewayInterface {
	private repositorioDados: DbConnection;
	private schema = 'ordersItens';

	constructor(database: DbConnection) {
		this.repositorioDados = database;
	}

	async find(reference: Record<string, any>): Promise<OrdersItens[] | null> {
		const result = await this.repositorioDados.find(this.schema, reference);

		if (result === null) {
			return null;
		} else {
			const returnData: OrdersItens[] = [];
			result.forEach((element: any) => {
				returnData.push(
					new OrdersItens(
						element.id,
						element.orderId,
						element.productId,
						element.price,
						element.quantity,
						element.obs,
						element.created_at,
						element.updated_at
					)
				);
			});
			return returnData;
		}
	}

	async findId(id: string): Promise<OrdersItens | null> {
		const result = await this.repositorioDados.findId(this.schema, id);

		if (result === null) {
			return null;
		} else {
			return new OrdersItens(
				result.id,
				result.orderId,
				result.productId,
				result.price,
				result.quantity,
				result.obs,
				result.created_at,
				result.updated_at
			);
		}
	}

	async findAll(): Promise<OrdersItens[] | null> {
		const result = await this.repositorioDados.findAll(this.schema);

		if (result === null) {
			return null;
		} else {
			const returnData: OrdersItens[] = [];
			result.forEach((element: any) => {
				returnData.push(
					new OrdersItens(
						element.id,
						element.orderId,
						element.productId,
						element.price,
						element.quantity,
						element.obs,
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
		productId: string,
		price: number,
		quantity: number,
		obs: string
	): Promise<any> {
		const orders = new OrdersItens(
			'',
			orderId,
			productId,
			price,
			quantity,
			obs,
			null,
			null
		)

		const success = await this.repositorioDados.persist(
			this.schema,
			{
				orderId: orders.orderId,
				productId: orders.productId,
				price: orders.price,
				quantity: orders.quantity,
				obs: orders.obs
			}
		);

		return success;
	}

	async update(
		id: string,
		price: number,
		quantity: number,
		obs: string
	): Promise<any> {
		const orders = new OrdersItens(
			id,
			'',
			'',
			price,
			quantity,
			obs,
			null,
			null
		)

		const success = await this.repositorioDados.update(
			this.schema,
			id,
			{
				price: orders.price,
				quantity: orders.quantity,
				obs: orders.obs
			}
		);

		return success;
	}

	async remove(id: string): Promise<any | null> {
		const result = await this.repositorioDados.remove(this.schema, id);

		return result;
	}

	async removeFind(reference: Record<string, any>): Promise<any | null> {
		const result = await this.repositorioDados.removeFind(
			this.schema,
			reference
		);

		return result;
	}

	async isValidId(id: string): Promise<Boolean> {
		const result = await this.repositorioDados.isValidId(id);

		return result;
	}
}
