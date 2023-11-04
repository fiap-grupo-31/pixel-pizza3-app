import { Products } from '../../domain/entities/Products';
import { ProductsImages } from '../../domain/entities/ProductsImages';
import { ProductsGatewayInterface } from '../../domain/interfaces/ProductsGatewayInterface';
import { ProductsImagesGatewayInterface } from '../../domain/interfaces/ProductsImagesGatewayInterface';

class ProductsImagesUseCases {
	static async getProductsImagesAll(
		ProductsImagesGateway: ProductsImagesGatewayInterface
	): Promise<ProductsImages[] | null> {
		const allProductsImages = await ProductsImagesGateway.findAll();
		return allProductsImages;
	}

	static async getProductsImagesByProductId(
		reference: Record<string, any> = {},
		ProductsImagesGateway: ProductsImagesGatewayInterface
	): Promise<ProductsImages[] | null> {
		const allProductsImages = await ProductsImagesGateway.find(reference);
		return allProductsImages;
	}

	static async getProductsImagesById(
		id: string,
		ProductsImagesGateway: ProductsImagesGatewayInterface
	): Promise<ProductsImages | null> {
		const productsImages = await ProductsImagesGateway.findId(id);
		return productsImages;
	}

	static async setProductImage(
		productId: string,
		name: string,
		size: string,
		type: string,
		base64: string,
		ProductsImagesGateway: ProductsImagesGatewayInterface,
		ProductsGateway: ProductsGatewayInterface
	): Promise<ProductsImages | null> {
		if (!productId) return Promise.reject('productId inválid');
		if (productId.length != 24) return Promise.reject('productId inválid');
		if (!name) return Promise.reject('name inválid');
		if (!size) return Promise.reject('size inválid');
		if (!type) return Promise.reject('type inválid');
		if (!base64) return Promise.reject('base64 inválid');

		try {
			// objectIdIsValid
			if (!ProductsImagesGateway.isValidId(productId))
				return Promise.reject('productId inválid');

			const product = await ProductsGateway.findId(productId);
			if (!product) return Promise.reject('productId inexistent');

			const productImage = await ProductsImagesGateway.persist(
				productId,
				name,
				size,
				type,
				base64
			);
			return new ProductsImages(
				productImage._id,
				productImage.productId,
				productImage.name,
				productImage.size,
				productImage.type,
				productImage.base64,
				productImage.created_at,
				productImage.updated_at
			);
		} catch (error) {
			return Promise.reject('failure insert');
		}
	}

	static async updateProductImage(
		id: string,
		productId: string,
		name: string,
		size: string,
		type: string,
		base64: string,
		ProductsImagesGateway: ProductsImagesGatewayInterface
	): Promise<ProductsImages | null> {
		if (!id) return Promise.reject('id image inválid');
		if (id.length != 24) return Promise.reject('id image inválid');
		if (!productId) return Promise.reject('id product inválid');
		if (productId.length != 24) return Promise.reject('id product inválid');
		if (!name) return Promise.reject('name inválid');
		if (!size) return Promise.reject('size inválid');
		if (!type) return Promise.reject('type inválid');
		if (!base64) return Promise.reject('base64 inválid');

		// objectIdIsValid
		if (!ProductsImagesGateway.isValidId(id))
			return Promise.reject('id image inválid');
		if (!ProductsImagesGateway.isValidId(productId))
			return Promise.reject('id product inválid');

		const product = await ProductsImagesGateway.find({
			_id: id,
			productId: productId,
		});

		if (!product) return Promise.reject('product image inexistent');
		if (!product?.length) return Promise.reject('product image inexistent');

		try {
			const productImage = await ProductsImagesGateway.update(
				id,
				name,
				size,
				type,
				base64
			);
			return new ProductsImages(
				productImage._id,
				productImage.productId,
				productImage.name,
				productImage.size,
				productImage.type,
				productImage.base64,
				productImage.created_at,
				productImage.updated_at
			);
		} catch (error) {
			return Promise.reject('failure update');
		}
	}

	static async removeProductsImagesById(
		id: string,
		ProductsImagesGateway: ProductsImagesGatewayInterface
	): Promise<any | null> {
		try {
			const productImage = await ProductsImagesGateway.remove(id);
			return Promise.resolve('removed');
		} catch (error) {
			return Promise.reject('id inexistent');
		}
	}
}

export { ProductsImagesUseCases };
