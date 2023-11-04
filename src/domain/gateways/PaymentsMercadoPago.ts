import { PaymentsMercadoPagoInterface } from '../interfaces/PaymentsMercadoPagoInterface';
import { HttpClient } from '../../infrastructure/external/http/http-client';

export class PaymentsMercadoPagoGateway
	implements PaymentsMercadoPagoInterface
{
	constructor(private readonly httpClient: HttpClient) {}

	async createPayment(data: Object | any): Promise<any> {
		try {
			const response = await this.httpClient.post(
				`https://api.mercadopago.com/instore/orders/qr/seller/collectors/${process.env.MELI_USER_ID}/pos/${process.env.MELI_POSID}/qrs`,
				data,
				{
					headers: {
						"Content-Type": "application/json",
						"Accept": "application/json",
                        "Authorization": `Bearer ${process.env.MELI_TOKEN}`
					},
				}
			);

			return response;
		} catch (error) {
			console.log(error)
			throw new Error('Erro ao criar pagamento no Mercado Pago');
		}
	}
}
