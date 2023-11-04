import { Products } from '../../domain/entities/Products';
import { ProductsGatewayInterface } from '../../domain/interfaces/ProductsGatewayInterface';

class ProductsUseCases {
	static async getProductsAll(
		productsGateway: ProductsGatewayInterface
	): Promise<Products[] | null> {
		const allProducts = await productsGateway.findAll();
		return allProducts;
	}

	static async getOrdersByParameter(
		reference: Record<string, any> = {},
		productsGateway: ProductsGatewayInterface
	): Promise<Products[] | null> {
		return await productsGateway.find(reference);
	}

	static async getProductsById(
		id: string,
		productsGateway: ProductsGatewayInterface
	): Promise<Products | null> {
		const product = await productsGateway.findId(id);
		return product;
	}

	static async setProduct(
		name: string,
		price: number,
		category: string,
		description: string,
		productsGateway: ProductsGatewayInterface
	): Promise<Products | null> {
		if (!name) return Promise.reject('nome inválid');
		if (!price) return Promise.reject('price inválid');
		if (!category) return Promise.reject('category inválid');

		try {
			const entity = new Products(
				'',
				name,
				price,
				category,
				description,
				null,
				null
			);
			
			const product = await productsGateway.persist(
				entity.name,
				entity.price,
				entity.category,
				entity.description
			);
			return new Products(
				product._id,
				product.name,
				product.price,
				product.category,
				product.description,
				product.created_at,
				product.updated_at
			);
		} catch (error) {
			return Promise.reject( (error instanceof Error ? error.message : `failure insert` ) );
		}
	}

	static async updateProduct(
		id: string,
		name: string,
		price: number,
		category: string,
		description: string,
		productsGateway: ProductsGatewayInterface
	): Promise<Products | null> {
		if (!name) return Promise.reject('nome inválid');
		if (!price) return Promise.reject('price inválid');
		if (!category) return Promise.reject('category inválid');

		try {
			const product = await productsGateway.update(
				id,
				name,
				price,
				category,
				description
			);
			return new Products(
				product._id,
				product.name,
				product.price,
				product.category,
				product.description,
				product.created_at,
				product.updated_at
			);
		} catch (error) {
			return Promise.reject('failure update');
		}
	}

	static async removeProductsById(
		id: string,
		productsGateway: ProductsGatewayInterface
	): Promise<any | null> {
		try {
			const product = await productsGateway.remove(id);
			return Promise.resolve('removed');
		} catch (error) {
			return Promise.reject('id inexistent');
		}
	}
}

export { ProductsUseCases };
