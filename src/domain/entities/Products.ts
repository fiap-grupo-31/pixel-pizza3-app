export class Products {
	private _id: string;
	private _name: string;
	private _price: number;
	private _category: string;
	private _description: string;
	private _created_at: Date;
	private _updated_at: Date;

	constructor(
		id: string,
		name: string,
		price: number,
		category: string,
		description: string,
		created_at: Date | any,
		updated_at: Date | any
	) {
		this._id = id;
		this._name = name || '';
		this._price = price || 0;
		this._category = category || '';
		this._description = description || '';
		this._created_at = created_at || '';
		this._updated_at = updated_at || '';

		if (!this.categoryCheck) {
			throw new Error('category invalid (ACCOMPANIMENT, DESSERT, DRINK, SNACK) ');
		}
	}

	get name(): string {
		return this._name;
	}

	get id(): string {
		return this._id;
	}

	get price(): number {
		return this._price;
	}

	get category(): string {
		return this._category;
	}

	get description(): string {
		return this._description;
	}

	get created_at(): Date {
		return this._created_at;
	}

	get updated_at(): Date {
		return this._updated_at;
	}

	get categoryCheck(): boolean {
		return [
			'ACCOMPANIMENT', 'DESSERT', 'DRINK', 'SNACK'
		].includes(this._category);
	}

	get isValid(): boolean {
		return this._id && this._id.length == 24 ? true : false;
	}
}
