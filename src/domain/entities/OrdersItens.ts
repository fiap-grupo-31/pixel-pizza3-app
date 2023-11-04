export class OrdersItens {
	private _id: string;
	private _orderId: string;
	private _productId: string;
	private _price: number;
	private _quantity: number;
	private _obs: string;
	private _created_at: Date;
	private _updated_at: Date;

	constructor(
		id: string,
		orderId: string,
		productId: string,
		price: number,
		quantity: number,
		obs: string,
		created_at: Date | any,
		updated_at: Date | any
	) {
		this._id = id;
		this._orderId = orderId || '';
		this._productId = productId || '';
		this._price = price || 0;
		this._quantity = quantity || 0;
		this._obs = obs || '';
		this._created_at = created_at || '';
		this._updated_at = updated_at || '';
	}

	get orderId(): string {
		return this._orderId;
	}

	get id(): string {
		return this._id;
	}

	get productId(): string {
		return this._productId;
	}

	get price(): number {
		return this._price;
	}
	get quantity(): number {
		return this._quantity;
	}
	get obs(): string {
		return this._obs;
	}

	get created_at(): Date {
		return this._created_at;
	}

	get updated_at(): Date {
		return this._updated_at;
	}

	get isValid(): boolean {
		return this._id && this._id.length == 24 ? true : false;
	}
}
