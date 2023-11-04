import { Payments } from '../../domain/entities/Payments';
import { PaymentsGatewayInterface } from '../../domain/interfaces/PaymentsGatewayInterface';

class PaymentsUseCases {
	static async getPaymentsAll(
		paymentsGateway: PaymentsGatewayInterface
	): Promise<Payments[] | null> {
		return await paymentsGateway.findAll();
	}

	static async getPaymentsByReference(
		reference: Record<string, any> = {},
		paymentsGateway: PaymentsGatewayInterface
	): Promise<Payments[] | null> {
		return await paymentsGateway.find(reference);
	}

	static async getPaymentsById(
		id: string,
		paymentsGateway: PaymentsGatewayInterface
	): Promise<Payments | null> {
		return await paymentsGateway.findId(id);
	}

	static async setPayment(
		orderId: string,
		broker: string,
		status: string,
		description: string,
		paymentsGateway: PaymentsGatewayInterface
	): Promise<Payments | null> {
		if (!orderId) return Promise.reject('orderId inválid');
		if (!broker) return Promise.reject('broker inválid');
		if (!status) return Promise.reject('status inválid');

		try {
			const payment = await paymentsGateway.persist(
				orderId,
				broker,
				status,
				description
			);
			return new Payments(
				payment._id,
				payment.orderId,
				payment.broker,
				payment.status,
				payment.description,
				payment.created_at,
				payment.updated_at
			);
		} catch (error) {
			return Promise.reject('failure insert');
		}
	}

	static async updatePayment(
		id: string,
		orderId: string,
		broker: string,
		status: string,
		description: string,
		paymentsGateway: PaymentsGatewayInterface
	): Promise<Payments | null> {
		if (!id) return Promise.reject('id inválid');
		if (!orderId) return Promise.reject('orderId inválid');
		if (!broker) return Promise.reject('broker inválid');
		if (!status) return Promise.reject('status inválid');

		const entity = new Payments(
			id,
			orderId,
			broker,
			status,
			description,
			null,
			null
		);
		if (!entity.paymentCheck) return Promise.reject('payment inválid');

		try {
			const payment = await paymentsGateway.update(
				id,
				orderId,
				broker,
				status,
				description
			);
			return new Payments(
				payment._id,
				payment.orderId,
				payment.broker,
				payment.status,
				payment.description,
				payment.created_at,
				payment.updated_at
			);
		} catch (error) {
			return Promise.reject('failure update');
		}
	}
}

export { PaymentsUseCases };
