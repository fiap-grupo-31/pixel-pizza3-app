import {
	OrdersGateway,
	PaymentsGateway,
	PaymentsMercadoPagoGateway,
} from '../../domain/gateways';
import { AxiosHttpClient } from '../../infrastructure/external/http/axios-client';
import { DbConnection } from '../../domain/interfaces/dbconnection';
import { QRCodeGeneratorAdapter } from '../../infrastructure/external/qrcode/qrcode';
import {
	OrdersUseCases,
	PaymentsUseCases,
	PaymentsMercadoPagoUseCases,
	GenerateQRCodeUseCase,
} from '../../application/usecases';
import { Global } from '../adapters';

/**
 * Pagamento
 *
 * @export
 * @class PaymentsController
 */
export class PaymentsController {
	/**
	 * Retorna todos os pagamentos listados (todos os status)
	 *
	 * @static
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof PaymentsController
	 */
	static async getPayments(dbconnection: DbConnection): Promise<string> {
		const paymentsGateway = new PaymentsGateway(dbconnection);
		const allPayments = await PaymentsUseCases.getPaymentsAll(
			paymentsGateway
		)
			.then((data) => {
				return Global.success(data);
			})
			.catch((err) => {
				return Global.error(err);
			});

		const adapted = JSON.stringify(allPayments);
		return adapted;
	}

	/**
	 * Retorna lista de pagamentos por status
	 *
	 * @static
	 * @param {string} reference
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof PaymentsController
	 */
	static async getPaymentsByStatus(
		reference: string,
		dbconnection: DbConnection
	): Promise<string> {
		const paymentsGateway = new PaymentsGateway(dbconnection);
		const allPayments = await PaymentsUseCases.getPaymentsByReference(
			{
				status: reference,
			},
			paymentsGateway
		)
			.then((data) => {
				return Global.success(data);
			})
			.catch((err) => {
				return Global.error(err);
			});

		return JSON.stringify(allPayments);
	}

	/**
	 * Retorna pagamento por id
	 *
	 * @static
	 * @param {string} id
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof PaymentsController
	 */
	static async getPaymentsById(
		id: string,
		dbconnection: DbConnection
	): Promise<string> {
		const paymentsGateway = new PaymentsGateway(dbconnection);
		const payment = await PaymentsUseCases.getPaymentsById(
			id,
			paymentsGateway
		)
			.then((data) => {
				return Global.success(data);
			})
			.catch((err) => {
				return Global.error(err);
			});

		const adapted = JSON.stringify(payment);
		return adapted;
	}

	/**
	 * Envia um pedido de pagamento para um broker e retorna
	 *
	 * @static
	 * @param {string} orderId
	 * @param {string} broker
	 * @param {string} status
	 * @param {string} description
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof PaymentsController
	 */
	static async setPayment(
		orderId: string,
		broker: string,
		status: string,
		description: string,
		dnsPublic: string,
		dbconnection: DbConnection
	): Promise<string> {

		if(!['fake','mercadopago'].includes(broker)){
			return JSON.stringify(Global.error(`escolha o broker fake ou mercadopago`));
		}

		const ordersGateway = new OrdersGateway(dbconnection);
		const order = await OrdersUseCases.getOrdersById(orderId, ordersGateway)
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		if (!order?._id) return JSON.stringify(Global.error(order));

		const paymentsGateway = new PaymentsGateway(dbconnection);
		const payment = 'WAITING';

		let paymentId: String | any;
		let webhook: String | any;
		let paymentObject = await PaymentsUseCases.setPayment(
			orderId,
			broker,
			payment,
			description,
			paymentsGateway
		)
			.then((data) => {
				let paymentConvert = Global.convertToObject(data);
				paymentId = paymentConvert._id;
				webhook = `${dnsPublic}/payment/webhook/${broker}/${paymentConvert._id}`;
				paymentConvert._webhook = webhook;
				return paymentConvert;
			})
			.catch((err) => {
				return Global.error(err);
			});
			
		if( broker == 'mercadopago' ){
			const paymentMercadopagoGateway = new PaymentsMercadoPagoGateway(
				new AxiosHttpClient('')
			);

			const webhookMeli: String =  `${
				process.env.MELI_WEBHOOK
					? `${process.env.MELI_WEBHOOK}/payment/webhook/mercadopago/${paymentId}`
					: `${dnsPublic}/payment/webhook/mercadopago/${paymentId}`
			}`;
			const paymentMercadoPagoObject =
				await PaymentsMercadoPagoUseCases.createPayment(
					{
						external_reference: paymentId,
						total_amount: 0.01, //order?._amount,
						items: [
							{
								sku_number: 'KS955RUR',
								category: 'FIAPPOS',
								title: 'FIAPPOS',
								description: 'FIAPPOS',
								quantity: order?._quantity,
								unit_measure: 'unit',
								unit_price: order?._amount,
								total_amount: 0.01 // order?._amount,
							},
						],
						title: 'Compra simulada FIAP - Tech Chanllenge',
						description: 'Compra',
						expiration_date:  new Date((new Date()).getTime() + 20 * 60 * 1000).toISOString().replace('Z','-03:00'),
						notification_url: webhookMeli,
						cash_out: {
							amount: 0,
						},
					},
					paymentMercadopagoGateway
				)
					.then((data) => {
						return data;
					})
					.catch((err) => {
						return Global.error(err);
					});
	
			if (!paymentMercadoPagoObject?.qr_data)
				return JSON.stringify(Global.error(paymentMercadoPagoObject));
	
			paymentObject.mercadopago = paymentMercadoPagoObject;
	
			const qrcode = new GenerateQRCodeUseCase(new QRCodeGeneratorAdapter());
			paymentObject.mercadopago.qrcode = await qrcode.execute(
				paymentMercadoPagoObject?.qr_data
			);
			paymentObject.mercadopago.webhook = webhookMeli;
			
		}

		paymentObject = Global.success(paymentObject);

		return JSON.stringify(paymentObject);
	}

	/**
	 * Atualiza parametros de um pagamento
	 *
	 * @static
	 * @param {string} id
	 * @param {(string | null)} orderId
	 * @param {(string | null)} broker
	 * @param {string} status
	 * @param {(string | null)} description
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof PaymentsController
	 */
	static async updatePayment(
		id: string,
		orderId: string | null,
		broker: string | null,
		status: string,
		description: string | null,
		dbconnection: DbConnection
	): Promise<string> {
		const paymentsGateway = new PaymentsGateway(dbconnection);
		if (!id) return JSON.stringify(Global.error(`id invalid`));
		if (!status) return JSON.stringify(Global.error(`status invalid`));

		if( status == 'payment.created' ) {
			status = 'APPROVED';
		}

		const paymentGet = await PaymentsUseCases.getPaymentsById(
			id,
			paymentsGateway
		)
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		const order = await PaymentsUseCases.updatePayment(
			id,
			orderId || paymentGet?._orderId,
			broker || paymentGet?._broker,
			status,
			description || paymentGet?._description,
			paymentsGateway
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
	 * Atualiza um pagamento por pedido
	 *
	 * @static
	 * @param {string} id
	 * @param {string} status
	 * @param {(string | null)} description
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof PaymentsController
	 */
	static async updatePaymentOrder(
		id: string,
		status: string,
		description: string | null,
		dbconnection: DbConnection
	): Promise<string> {
		const paymentsGateway = new PaymentsGateway(dbconnection);

		const paymentGet = await PaymentsUseCases.getPaymentsByReference(
			{
				orderId: id,
			},
			paymentsGateway
		)
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		const order = await PaymentsUseCases.updatePayment(
			paymentGet?._id,
			paymentGet?._orderId,
			paymentGet?._broker,
			status,
			description || paymentGet?._description,
			paymentsGateway
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
}
