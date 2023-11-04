export class ProductsImages {
	private _id: string;
	private _productId: string;
	private _name: string;
	private _size: string;
	private _type: string;
	private _base64: string;
	private _created_at: Date;
	private _updated_at: Date;

	constructor(
		id: string,
		productId: string,
		name: string,
		size: string,
		type: string,
		base64: string,
		created_at: Date | any,
		updated_at: Date | any
	) {
		this._id = id;
		this._productId = productId || '';
		this._name = name || '';
		this._size = size || '';
		this._type = type || '';
		this._base64 = base64 || '';
		this._created_at = created_at || '';
		this._updated_at = updated_at || '';
	}

	get name(): string {
		return this._name;
	}

	get id(): string {
		return this._id;
	}

	get productId(): string {
		return this._productId;
	}

	get size(): string {
		return this._size;
	}

	get type(): string {
		return this._type;
	}

	get base64(): string {
		return this._base64;
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
