export interface PaymentsMercadoPagoInterface {
	createPayment(data: any): Promise<any>;
}
