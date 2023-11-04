import { OrdersItemsGateway } from '../../domain/gateways';
import { Orders } from '../../domain/entities/Orders';
import { OrdersGatewayInterface } from '../../domain/interfaces/OrdersGatewayInterface';
import { OrdersItensGatewayInterface } from '../../domain/interfaces/OrdersItensGatewayInterface';

class OrdersUseCases {
	static async getOrdersAll(
		ordersGateway: OrdersGatewayInterface
	): Promise<Orders[] | null> {
		return await ordersGateway.findAll();
	}

	static async getOrdersByStatus(
		reference: Record<string, any> = {},
		ordersGateway: OrdersGatewayInterface
	): Promise<Orders[] | null> {
		return await ordersGateway.find(reference);
	}

	static async getOrdersById(
		id: string,
		ordersGateway: OrdersGatewayInterface
	): Promise<Orders | null> {
		return await ordersGateway.findId(id);
	}

	static async setOrders(
		customerId: string,
		quantity: number,
		amount: number,
		status: string,
		payment: string,
		ordersGateway: OrdersGatewayInterface
	): Promise<Orders | null> {
		if (customerId) {
			if (customerId.length != 24)
				return Promise.reject('customerId inválid');

			if (!ordersGateway.isValidId(customerId))
				return Promise.reject('customerId inválid');
		}

		const entity = new Orders(
			'',
			0,
			customerId,
			quantity,
			amount,
			status,
			payment,
			null,
			null
		);

		if (!entity.statusCheck) return Promise.reject('status inválid');
		if (!entity.paymentCheck) return Promise.reject('payment inválid');
		if (!entity.statusWithPaymentCheck)
			return Promise.reject('payment which status inválid');

		try {
			const customers = await ordersGateway.persist(
				customerId,
				quantity,
				amount,
				status,
				payment
			);
			return new Orders(
				customers._id,
				customers.protocol,
				customers.customerId,
				customers.quantity,
				customers.amount,
				customers.status,
				customers.payment,
				customers.created_at,
				customers.updated_at
			);
		} catch (error) {
			return Promise.reject( (error instanceof Error ? error.message : `failure insert` ) );
		}
	}

	static async updateOrders(
		id: string,
		customerId: string | null,
		quantity: number | 0,
		amount: number | 0,
		status: string,
		payment: string,
		ordersGateway: OrdersGatewayInterface
	): Promise<Orders | null> {
		if (!status) return Promise.reject('status inválid');

		if (['DENIED', 'CANCELED'].includes(payment)) {
			status = 'CANCELED';
			payment = 'CANCELED';
		}

		if (['CANCELED'].includes(status)) {
			status = 'CANCELED';
			payment = 'CANCELED';
		}

		const entity = new Orders(
			'',
			0,
			customerId,
			quantity,
			amount,
			status,
			payment,
			null,
			null
		);

		if (!entity.statusCheck) return Promise.reject('status inválid');
		if (!entity.paymentCheck) return Promise.reject('payment inválid');
		if (!entity.statusWithPaymentCheck)
			return Promise.reject('payment which status inválid');

		try {
			const customers = await ordersGateway.update(
				id,
				customerId,
				quantity,
				amount,
				status,
				payment
			);
			return new Orders(
				customers._id,
				customers.protocol,
				customers.customerId,
				customers.quantity,
				customers.amount,
				customers.status,
				customers.payment,
				customers.created_at,
				customers.updated_at
			);
		} catch (error) {
			return Promise.reject('failure update');
		}
	}

	static async removeOrdersById(
		id: string,
		ordersGateway: OrdersGatewayInterface
	): Promise<any | null> {
		try {
			const product = await ordersGateway.remove(id);
			return Promise.resolve('removed');
		} catch (error) {
			return Promise.reject('id inexistent');
		}
	}
}

export { OrdersUseCases };
