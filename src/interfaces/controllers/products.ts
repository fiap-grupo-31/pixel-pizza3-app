import { ProductsGateway } from '../../domain/gateways';
import { DbConnection } from '../../domain/interfaces/dbconnection';
import { ProductsUseCases } from '../../application/usecases';

import { Global } from '../adapters';

/**
 * Produtos
 *
 * @export
 * @class ProductsController
 */
export class ProductsController {
	/**
	 * Retona todos os produtos
	 *
	 * @static
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<any>}
	 * @memberof ProductsController
	 */
	static async getProducts(
		category: string | any,
		dbconnection: DbConnection): Promise<any> {
		const productsGateway = new ProductsGateway(dbconnection);
		if(category){
			return await ProductsUseCases.getOrdersByParameter({
				category: category
			},
				productsGateway
			)
				.then((data) => {
					return Global.success(data);
				})
				.catch((err) => {
					return Global.error(err);
				});

		}else{
			return await ProductsUseCases.getProductsAll(
				productsGateway
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
	 * Retona um produto por id
	 *
	 * @static
	 * @param {string} id
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<any>}
	 * @memberof ProductsController
	 */
	static async getProductsById(
		id: string,
		dbconnection: DbConnection
	): Promise<any> {
		const productsGateway = new ProductsGateway(dbconnection);
		const product = await ProductsUseCases.getProductsById(
			id,
			productsGateway
		)
			.then((data) => {
				return Global.success(data);
			})
			.catch((err) => {
				return Global.error(err);
			});

		const adapted = product;
		return adapted;
	}

	/**
	 * Cadastra um produto
	 *
	 * @static
	 * @param {string} name
	 * @param {number} price
	 * @param {string} category
	 * @param {string} description
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<any>}
	 * @memberof ProductsController
	 */
	static async setProduct(
		name: string,
		price: number,
		category: string,
		description: string,
		dbconnection: DbConnection
	): Promise<any> {
		const productsGateway = new ProductsGateway(dbconnection);
		const product = await ProductsUseCases.setProduct(
			name,
			price,
			category,
			description,
			productsGateway
		)
			.then((data) => {
				return Global.success(data);
			})
			.catch((err) => {
				return Global.error(err);
			});

		const adapted = product;
		return adapted;
	}

	/**
	 * Atualiza um produto
	 *
	 * @static
	 * @param {string} id
	 * @param {string} name
	 * @param {number} price
	 * @param {string} category
	 * @param {string} description
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<any>}
	 * @memberof ProductsController
	 */
	static async updateProduct(
		id: string,
		name: string,
		price: number,
		category: string,
		description: string,
		dbconnection: DbConnection
	): Promise<any> {
		const productsGateway = new ProductsGateway(dbconnection);
		const product = await ProductsUseCases.updateProduct(
			id,
			name,
			price,
			category,
			description,
			productsGateway
		)
			.then((data) => {
				return Global.success(data);
			})
			.catch((err) => {
				return Global.error(err);
			});

		const adapted = product;
		return adapted;
	}

	/**
	 * Remove um produto por id
	 *
	 * @static
	 * @param {string} id
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<any>}
	 * @memberof ProductsController
	 */
	static async removeProductsById(
		id: string,
		dbconnection: DbConnection
	): Promise<any> {
		const productsGateway = new ProductsGateway(dbconnection);
		const product = await ProductsUseCases.removeProductsById(
			id,
			productsGateway
		)
			.then((data) => {
				return Global.success(data);
			})
			.catch((err) => {
				return Global.error(err);
			});

		const adapted = product;
		return adapted;
	}
}
