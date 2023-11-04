import { PaymentsMercadoPagoInterface } from '../../domain/interfaces/PaymentsMercadoPagoInterface';

class PaymentsMercadoPagoUseCases {
	static async createPayment(
		data: Object,
		paymentsGateway: PaymentsMercadoPagoInterface
		): Promise<any> {
		try {
			const paymentResponse =
				await paymentsGateway.createPayment(data);
			return paymentResponse;
		} catch (error) {
			console.log( error )
			throw new Error('Erro ao criar pagamento');
		}
	}
}

export { PaymentsMercadoPagoUseCases };
