import { ProductsImages } from 'src/domain/entities/ProductsImages';

interface ProductsImagesGatewayInterface {
	findId(id: string): Promise<ProductsImages | null>;
	find(Reference: Record<string, any>): Promise<ProductsImages[] | null>;
	remove(id: string): Promise<any | null>;
	findAll(): Promise<ProductsImages[] | null>;
	persist(
		productId: string,
		name: string,
		size: string,
		type: string,
		base64: string
	): Promise<any>;
	update(
		id: string,
		name: string,
		size: string,
		type: string,
		base64: string
	): Promise<any>;
	isValidId(id: string): Promise<Boolean>;
}

export { ProductsImagesGatewayInterface }