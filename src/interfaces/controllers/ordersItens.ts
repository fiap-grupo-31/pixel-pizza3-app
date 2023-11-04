import { OrdersItemsGateway } from '../../domain/gateways';

import { DbConnection } from '../../domain/interfaces/dbconnection';
import { OrdersItensUseCases } from '../../application/usecases';
import { Global } from '../adapters';

/**
 * Pedidos (itens)
 *
 * @export
 * @class OrdersItensController
 */
export class OrdersItensController {
	/**
	 * Retorna todos os itens de pedidos
	 *
	 * @static
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof OrdersItensController
	 */
	static async getOrders(dbconnection: DbConnection): Promise<string> {
		const ordersItensGateway = new OrdersItemsGateway(dbconnection);
		const allOrders = await OrdersItensUseCases.getOrdersItensAll(
			ordersItensGateway
		)
			.then((data) => {
				return Global.success(data);
			})
			.catch((err) => {
				return Global.error(err);
			});

		const adapted = JSON.stringify(allOrders);
		return adapted;
	}

	/**
	 * Retona um item de um pedido por id
	 *
	 * @static
	 * @param {string} id
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof OrdersItensController
	 */
	static async getOrdersById(
		id: string,
		dbconnection: DbConnection
	): Promise<string> {
		const ordersItensGateway = new OrdersItemsGateway(dbconnection);
		const order = await OrdersItensUseCases.getOrdersItensById(
			id,
			ordersItensGateway
		)
			.then((data) => {
				return Global.success(data);
			})
			.catch((err) => {
				return Global.error(err);
			});

		const adapted = JSON.stringify(order);
		return adapted;
	}

	/**
	 * Cadastra um item em um pedido
	 *
	 * @static
	 * @param {string} orderId
	 * @param {string} productId
	 * @param {number} quantity
	 * @param {string} obs
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof OrdersItensController
	 */
	static async setOrder(
		orderId: string,
		productId: string,
		quantity: number,
		obs: string,
		dbconnection: DbConnection
	): Promise<string> {
		const ordersItensGateway = new OrdersItemsGateway(dbconnection);

		const orderItem = await OrdersItensUseCases.setOrdersItens(
			orderId,
			productId,
			0,
			quantity,
			obs,
			ordersItensGateway
		)
			.then((data) => {
				return Global.success(data);
			})
			.catch((err) => {
				return Global.error(err);
			});

		const adapted = JSON.stringify(orderItem);
		return adapted;
	}

	/**
	 * Atualiza um item de um pedido
	 *
	 * @static
	 * @param {string} id
	 * @param {string} orderId
	 * @param {string} productId
	 * @param {number} price
	 * @param {number} quantity
	 * @param {string} obs
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof OrdersItensController
	 */
	static async updateOrder(
		id: string,
		orderId: string,
		productId: string,
		price: number,
		quantity: number,
		obs: string,
		dbconnection: DbConnection
	): Promise<string> {
		const ordersItensGateway = new OrdersItemsGateway(dbconnection);
		const orderItem = await OrdersItensUseCases.updateOrdersItens(
			id,
			price,
			quantity,
			obs,
			ordersItensGateway
		)
			.then((data) => {
				return Global.success(data);
			})
			.catch((err) => {
				return Global.error(err);
			});

		const adapted = JSON.stringify(orderItem);
		return adapted;
	}

	/**
	 * Remove um item de um pedido por id
	 *
	 * @static
	 * @param {string} id
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof OrdersItensController
	 */
	static async removeOrdersById(
		id: string,
		dbconnection: DbConnection
	): Promise<string> {
		const ordersItensGateway = new OrdersItemsGateway(dbconnection);
		const orderItem = await OrdersItensUseCases.removeOrdersItensById(
			id,
			ordersItensGateway
		)
			.then((data) => {
				return Global.success(data);
			})
			.catch((err) => {
				return Global.error(err);
			});

		const adapted = JSON.stringify(orderItem);
		return adapted;
	}

	/**
	 * Remove todos os itens de um pedido por id
	 *
	 * @static
	 * @param {string} id
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof OrdersItensController
	 */
	static async removeOrdersByOrderId(
		id: string,
		dbconnection: DbConnection
	): Promise<string> {
		const ordersItensGateway = new OrdersItemsGateway(dbconnection);
		const orderItem = await OrdersItensUseCases.removeOrdersItensById(
			id,
			ordersItensGateway
		)
			.then((data) => {
				return Global.success(data);
			})
			.catch((err) => {
				return Global.error(err);
			});

		const adapted = JSON.stringify(orderItem);
		return adapted;
	}
}
