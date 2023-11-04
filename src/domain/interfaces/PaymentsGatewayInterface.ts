import { Payments } from 'src/domain/entities/Payments';

interface PaymentsGatewayInterface {
	findId(id: string): Promise<Payments | null>;
	find(Reference: Record<string, any>): Promise<Payments[] | null>;
	findAll(): Promise<Payments[] | null>;
	persist(
		orderId: string,
		broker: string,
		status: string,
		description: string
	): Promise<any>;
	update(
		id: string,
		orderId: string,
		broker: string,
		status: string,
		description: string
	): Promise<any>;
	isValidId(id: string): Promise<Boolean>;
}

export { PaymentsGatewayInterface }