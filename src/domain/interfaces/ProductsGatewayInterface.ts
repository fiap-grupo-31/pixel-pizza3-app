import { Products } from 'src/domain/entities/Products';

interface ProductsGatewayInterface {
	findId(id: string): Promise<Products | null>;
	find(Reference: Record<string, any>): Promise<Products[] | null>;
	remove(id: string): Promise<any | null>;
	findAll(): Promise<Products[] | null>;
	persist(
		name: string,
		price: number,
		category: string,
		description: string
	): Promise<any>;
	update(
		id: string,
		name: string,
		price: number,
		category: string,
		description: string
	): Promise<any>;
}

export { ProductsGatewayInterface }