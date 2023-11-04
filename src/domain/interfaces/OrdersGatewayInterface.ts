import { Orders } from 'src/domain/entities/Orders';

interface OrdersGatewayInterface {
	findId(id: string): Promise<Orders | null>;
	find(Reference: Record<string, any>): Promise<Orders[] | null>;
	remove(id: string): Promise<any | null>;
	findAll(): Promise<Orders[] | null>;
	persist(
		customer: string | null ,
		quantity: number,
		amount: number,
		status: string,
		payment: string | null
	): Promise<any>;
	update(
		id: string,
		customer: string | null,
		quantity: number,
		amount: number,
		status: string,
		payment: string | null
	): Promise<any>;
	isValidId(id: string): Promise<Boolean>;
}

export { OrdersGatewayInterface }