import { Customers } from '../../domain/entities/Customers';
import { CustomersGatewayInterface } from '../../domain/interfaces/CustomersGatewayInterface';

class CustomersUseCases {
	static async getCustomersAll(
		customersGateway: CustomersGatewayInterface
	): Promise<Customers[] | null> {
		const allCustomers = await customersGateway.findAll();
		return allCustomers;
	}

	static async getCustomersByParameter(
		reference: Record<string, any> = {},
		customersGateway: CustomersGatewayInterface
	): Promise<Customers[] | null> {
		return await customersGateway.find(reference);
	}

	static async getCustomersById(
		id: string,
		customersGateway: CustomersGatewayInterface
	): Promise<Customers | null> {
		const customer = await customersGateway.findId(id);
		return customer;
	}

	static async setCustomer(
		name: string,
		mail: string,
		cpf: string,
		birthdate: Date,
		subscription: string,
		customersGateway: CustomersGatewayInterface
	): Promise<Customers | null> {
		if (!name) return Promise.reject('nome inválid');

		try {
			const customer = await customersGateway.persist(
				name,
				mail,
				cpf,
				birthdate,
				subscription
			);
			return new Customers(
				customer._id,
				customer.name,
				customer.mail,
				customer.cpf,
				customer.birthdate,
				customer.subscription,
				customer.created_at,
				customer.updated_at
			);
		} catch (error) {
			return Promise.reject( (error instanceof Error ? error.message : `failure insert` ) );
		}
	}

	static async updateCustomer(
		id: string,
		name: string,
		mail: string,
		cpf: string,
		birthdate: Date,
		subscription: string,
		customersGateway: CustomersGatewayInterface
	): Promise<Customers | null> {
		if (!name) return Promise.reject('nome inválid');

		try {
			const customer = await customersGateway.update(
				id,
				name,
				mail,
				cpf,
				birthdate,
				subscription
			);
			return new Customers(
				customer._id,
				customer.name,
				customer.mail,
				customer.cpf,
				customer.birthdate,
				customer.subscription,
				customer.created_at,
				customer.updated_at
			);
		} catch (error) {
			return Promise.reject( (error instanceof Error ? error.message : `failure update` ) );
		}
	}

	static async removeCustomersById(
		id: string,
		customersGateway: CustomersGatewayInterface
	): Promise<any | null> {
		try {
			const product = await customersGateway.remove(id);
			return Promise.resolve('removed');
		} catch (error) {
			return Promise.reject('id inexistent');
		}
	}
}

export { CustomersUseCases };
