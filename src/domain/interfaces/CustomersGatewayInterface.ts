import { Customers } from 'src/domain/entities/Customers';

interface CustomersGatewayInterface {
	findId(id: string): Promise<Customers | null>;
	find(Reference: Record<string, any>): Promise<Customers[] | null>;
	remove(id: string): Promise<any | null>;
	findAll(): Promise<Customers[] | null>;
	persist(
		name: string,
		mail: string,
		cpf: string,
		birthdate: Date,
		subscription: string
	): Promise<any>;
	update(
		id: string,
		name: string,
		mail: string,
		cpf: string,
		birthdate: Date,
		subscription: string
	): Promise<any>;
	isValidId(id: string): Promise<Boolean>;
}

export { CustomersGatewayInterface };
