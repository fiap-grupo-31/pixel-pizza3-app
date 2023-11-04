import { CustomersGateway } from '../../domain/gateways';
import { DbConnection } from '../../domain/interfaces/dbconnection';
import { CustomersUseCases } from '../../application/usecases';
import { Global } from '../adapters';


/**
 * Clientes
 *
 * @export
 * @class CustomersController
 */
export class CustomersController {

	/**
	 * Retorna todos os clientes
	 *
	 * @static
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof CustomersController
	 */
	static async getCustomers(
		cpf: string | any,
		dbconnection: DbConnection): Promise<any> {
		const customersGateway = new CustomersGateway(dbconnection);
		if(cpf){
			return await CustomersUseCases.getCustomersByParameter({
				cpf: cpf
			},
				customersGateway
			)
				.then((data) => {
					return Global.success(data);
				})
				.catch((err) => {
					return Global.error(err);
				});
		}else{
			return await CustomersUseCases.getCustomersAll(
				customersGateway
			)
				.then((data) => {
					return Global.success(data);
				})
				.catch((err) => {
					return Global.error(err);
				});
		}
	}
	
	/**
	 * Retona um cliente por id
	 *
	 * @static
	 * @param {string} id
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof CustomersController
	 */
	static async getCustomersById(
		id: string,
		dbconnection: DbConnection
	): Promise<string> {
		const customersGateway = new CustomersGateway(dbconnection);
		const customer = await CustomersUseCases.getCustomersById(
			id,
			customersGateway
		)
		.then((data) => {
			return Global.success(data);
		})
		.catch((err) => {
			return Global.error(err);
		});

		const adapted = JSON.stringify(customer);
		return adapted;
	}

	/**
	 * Cadastra um cliente
	 *
	 * @static
	 * @param {string} name
	 * @param {string} mail
	 * @param {string} cpf
	 * @param {Date} birthdate
	 * @param {string} subscription
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof CustomersController
	 */
	static async setCustomer(
		name: string,
		mail: string,
		cpf: string,
		birthdate: Date,
		subscription: string,
		dbconnection: DbConnection
	): Promise<string> {
		const customersGateway = new CustomersGateway(dbconnection);
		const customer = await CustomersUseCases.setCustomer(
			name,
			mail,
			cpf,
			birthdate,
			subscription,
			customersGateway
		)
			.then((data) => {
				return Global.success(data);
			})
			.catch((err) => {
				return Global.error(err);
			});

		const adapted = JSON.stringify(customer);
		return adapted;
	}

	/**
	 * Atualia os parametros de um cliente
	 *
	 * @static
	 * @param {string} id
	 * @param {string} name
	 * @param {string} mail
	 * @param {string} cpf
	 * @param {Date} birthdate
	 * @param {string} subscription
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof CustomersController
	 */
	static async updateCustomer(
		id: string,
		name: string,
		mail: string,
		cpf: string,
		birthdate: Date,
		subscription: string,
		dbconnection: DbConnection
	): Promise<string> {
		const customersGateway = new CustomersGateway(dbconnection);
		const product = await CustomersUseCases.updateCustomer(
			id,
			name,
			mail,
			cpf,
			birthdate,
			subscription,
			customersGateway
		)
			.then((data) => {
				return Global.success(data);
			})
			.catch((err) => {
				return Global.error(err);
			});

		const adapted = JSON.stringify(product);
		return adapted;
	}

	/**
	 * Remove um cliente por id
	 *
	 * @static
	 * @param {string} id
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof CustomersController
	 */
	static async removeCustomersById(
		id: string,
		dbconnection: DbConnection
	): Promise<string> {
		const customersGateway = new CustomersGateway(dbconnection);
		const product = await CustomersUseCases.removeCustomersById(
			id,
			customersGateway
		)
			.then((data) => {
				return Global.success(data);
			})
			.catch((err) => {
				return Global.error(err);
			});

		const adapted = JSON.stringify(product);
		return adapted;
	}
}
