import { OrdersItens } from '../../domain/entities/OrdersItens';
import { OrdersItensGatewayInterface } from '../../domain/interfaces/OrdersItensGatewayInterface';

class OrdersItensUseCases {
	static async getOrdersItensAll(
		ordersItensGateway: OrdersItensGatewayInterface
	): Promise<OrdersItens[] | null> {
		return await ordersItensGateway.findAll();
	}

	static async getOrdersItensById(
		id: string,
		ordersItensGateway: OrdersItensGatewayInterface
	): Promise<OrdersItens | null> {
		return await ordersItensGateway.findId(id);
	}

	static async getOrdersItensByOrderId(
		reference: Record<string, any> = {},
		ordersItensGateway: OrdersItensGatewayInterface
	): Promise<OrdersItens[] | null> {
		return await ordersItensGateway.find(reference);
	}

	static async setOrdersItens(
		orderId: string,
		productId: string,
		price: number,
		quantity: number,
		obs: string,
		ordersItensGateway: OrdersItensGatewayInterface
	): Promise<OrdersItens | null> {
		if (orderId.length != 24 || !ordersItensGateway.isValidId(orderId))
			return Promise.reject('orderId inválid');

		if (productId.length != 24 || !ordersItensGateway.isValidId(productId))
			return Promise.reject('productId inválid');

		try {
			const orders = await ordersItensGateway.persist(
				orderId,
				productId,
				price,
				quantity,
				obs
			);
			return new OrdersItens(
				orders._id,
				orders.orderId,
				orders.productId,
				orders.price,
				orders.quantity,
				orders.obs,
				orders.created_at,
				orders.updated_at
			);
		} catch (error) {
			return Promise.reject('failure insert');
		}
	}

	static async updateOrdersItens(
		id: string,
		price: number,
		quantity: number,
		obs: string,
		ordersItensGateway: OrdersItensGatewayInterface
	): Promise<OrdersItens | null> {
		try {
			const orders = await ordersItensGateway.update(
				id,
				price,
				quantity,
				obs
			);
			return new OrdersItens(
				orders._id,
				orders.orderId,
				orders.productId,
				orders.price,
				orders.quantity,
				orders.obs,
				orders.created_at,
				orders.updated_at
			);
		} catch (error) {
			return Promise.reject('failure update');
		}
	}

	static async removeOrdersItensById(
		id: string,
		ordersItensGateway: OrdersItensGatewayInterface
	): Promise<any | null> {
		try {
			const product = await ordersItensGateway.remove(id);
			return Promise.resolve('removed');
		} catch (error) {
			return Promise.reject('id inexistent');
		}
	}

	static async removeOrdersItensByOrderId(
		id: string,
		ordersItensGateway: OrdersItensGatewayInterface
	): Promise<any | null> {
		console.log(id);
		try {
			const product = await ordersItensGateway.removeFind({
				orderId: id,
			});
			return Promise.resolve('removed');
		} catch (error) {
			return Promise.reject('id inexistent');
		}
	}
}

export { OrdersItensUseCases };
