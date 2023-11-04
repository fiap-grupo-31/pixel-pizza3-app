import { ProductsGateway } from '../../domain/gateways';
import { ProductsImagesGateway } from '../../domain/gateways';
import { DbConnection } from '../../domain/interfaces/dbconnection';
import { ProductsImagesUseCases } from '../../application/usecases';
import { Global } from '../../interfaces/adapters';

/**
 * Proutos (itens)
 *
 * @export
 * @class ProductsImagesController
 */
export class ProductsImagesController {
	/**
	 * Retorna todos as imagens de um produto
	 *
	 * @static
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof ProductsImagesController
	 */
	static async getProductsImages(
		dbconnection: DbConnection
	): Promise<string> {
		const productsImagesGateway = new ProductsImagesGateway(dbconnection);
		const allProducts = await ProductsImagesUseCases.getProductsImagesAll(
			productsImagesGateway
		)
			.then((data) => {
				return Global.success(data);
			})
			.catch((err) => {
				return Global.error(err);
			});

		const adapted = JSON.stringify(allProducts);
		return adapted;
	}

	/**
	 * Retorna todas as imagens de um produtoId
	 *
	 * @static
	 * @param {Record<string, any>} [reference={}]
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof ProductsImagesController
	 */
	static async getProductsImagesByProductId(
		reference: Record<string, any> = {},
		dbconnection: DbConnection
	): Promise<string> {
		const productsImagesGateway = new ProductsImagesGateway(dbconnection);
		const allProducts =
			await ProductsImagesUseCases.getProductsImagesByProductId(
				reference,
				productsImagesGateway
			)
				.then((data) => {
					return Global.success(data);
				})
				.catch((err) => {
					return Global.error(err);
				});

		const adapted = JSON.stringify(allProducts);
		return adapted;
	}

	/**
	 * Retona uma imagem por id
	 *
	 * @static
	 * @param {string} id
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof ProductsImagesController
	 */
	static async getProductsImagesById(
		id: string,
		dbconnection: DbConnection
	): Promise<string> {
		const productsImagesGateway = new ProductsImagesGateway(dbconnection);
		const product = await ProductsImagesUseCases.getProductsImagesById(
			id,
			productsImagesGateway
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
	 * Cadastra uma imagem para um produto
	 *
	 * @static
	 * @param {string} productId
	 * @param {string} name
	 * @param {string} size
	 * @param {string} type
	 * @param {string} base64
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof ProductsImagesController
	 */
	static async setProductImage(
		productId: string,
		name: string,
		size: string,
		type: string,
		base64: string,
		dbconnection: DbConnection
	): Promise<string> {
		const productsImagesGateway = new ProductsImagesGateway(dbconnection);
		const productsGateway = new ProductsGateway(dbconnection);

		const product = await ProductsImagesUseCases.setProductImage(
			productId,
			name,
			size,
			type,
			base64,
			productsImagesGateway,
			productsGateway
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
	 * Atualiza uma imagem por id
	 *
	 * @static
	 * @param {string} id
	 * @param {string} productId
	 * @param {string} name
	 * @param {string} size
	 * @param {string} type
	 * @param {string} base64
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof ProductsImagesController
	 */
	static async updateProductImage(
		id: string,
		productId: string,
		name: string,
		size: string,
		type: string,
		base64: string,
		dbconnection: DbConnection
	): Promise<string> {
		const productsImagesGateway = new ProductsImagesGateway(dbconnection);
		const product = await ProductsImagesUseCases.updateProductImage(
			id,
			productId,
			name,
			size,
			type,
			base64,
			productsImagesGateway
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
	 * Remove uma imagem de um produto por id
	 *
	 * @static
	 * @param {string} id
	 * @param {DbConnection} dbconnection
	 * @return {*}  {Promise<string>}
	 * @memberof ProductsImagesController
	 */
	static async removeProductsImagesById(
		id: string,
		dbconnection: DbConnection
	): Promise<string> {
		const productsImagesGateway = new ProductsImagesGateway(dbconnection);
		const product = await ProductsImagesUseCases.removeProductsImagesById(
			id,
			productsImagesGateway
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
