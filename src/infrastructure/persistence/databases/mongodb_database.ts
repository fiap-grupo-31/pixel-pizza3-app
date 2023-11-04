import { DbConnection } from '../../../domain/interfaces/dbconnection';
import { ParametroBd } from '@types';
import mongoose from 'mongoose';
import {
	customerSchema,
	producstSchema,
	productImagesSchema,
	ordersSchema,
	orderItemsSchema,
	paymentsSchema,
} from './mongo/index';

const getSchemas = (key: string) => {
	let models = mongoose.model('Products', producstSchema);
	switch (key) {
		case 'orders':
			models = mongoose.model('Orders', ordersSchema);
			break;
		case 'ordersItens':
			models = mongoose.model('OrdersItens', orderItemsSchema);
			break;
		case 'products':
			models = mongoose.model('Products', producstSchema);
			break;
		case 'productsImages':
			models = mongoose.model('ProductsImages', productImagesSchema);
			break;
		case 'customers':
			models = mongoose.model('Customers', customerSchema);
			break;
		case 'payments':
			models = mongoose.model('Payments', paymentsSchema);
			break;
	}
	return models;
};

export class MongodbConnection implements DbConnection {
	constructor() {
		const {
			DB_HOST,
			DB_PORT,
			DB_DATABASE,
			DB_USER,
			DB_PASS,
			DB_STRING_CLOUD,
		} = process.env;

		const connectionString = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}?authSource=admin`;

		try {
			if (DB_STRING_CLOUD) {
				let options = {}
				if( DB_STRING_CLOUD.indexOf('docdb') > -1 )
					options = {
						ssl: true,
						tlsAllowInvalidCertificates: false,
						tlsCAFile: './global-bundle.pem',
						useNewUrlParser: true
					} as any;
	
				mongoose.connect(DB_STRING_CLOUD, options);
			} else if(DB_HOST){
				mongoose.connect(connectionString, {
					user: DB_USER,
					pass: DB_PASS,
				});
			}
		} catch (error) {
			process.exit(1)
		}

		const db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', () => {
			console.log('connected to MongoDB database!');
		});
		db.on('all', function (d) {});
	}

	async findId(Schema: string, Id: string): Promise<any> {
		const model = getSchemas(Schema);
		const rows = await model.findById(Id);

		return rows;
	}

	async find(Schema: string, Reference: Record<string, any>): Promise<any> {
		const model = getSchemas(Schema);
		const rows = await model.find(Reference);

		return rows;
	}

	async findAll(Schema: string): Promise<any[]> {
		const model = getSchemas(Schema);
		const rows = await model.find();

		return rows;
	}

	async persist(Schema: string, parametros: ParametroBd[] | Object): Promise<any> {
		let objectInsert: Record<string, any> = {};

		if( Array.isArray(parametros) ){
			parametros.forEach(function (item) {
				if (item.valor != null) objectInsert[item.campo] = item.valor;
			});
		}else{
			objectInsert = parametros
		}

		const model = getSchemas(Schema);
		const Instance = new model(objectInsert);
		await Instance.save();
		return Instance;
	}

	async update(
		Schema: string,
		Id: string,
		parametros: ParametroBd[] | Object
	): Promise<any> {
		let objectUpdate: Record<string, any> = {};

		if( Array.isArray(parametros) ){
			parametros.forEach(function (item) {
				if (item.valor != null) objectUpdate[item.campo] = item.valor;
			});
		}else{
			objectUpdate = parametros
		}

		const model = getSchemas(Schema);
		const Instance = await model.findByIdAndUpdate(Id, objectUpdate, {
			new: true,
		});

		return Instance;
	}

	async remove(Schema: string, Id: string): Promise<any> {
		const model = getSchemas(Schema);
		const rowDelete = await model.findOneAndDelete({
			_id: Id,
		});

		return rowDelete ? true : false;
	}

	async removeFind(
		Schema: string,
		Reference: Record<string, any>
	): Promise<any> {
		const model = getSchemas(Schema);

		const rows = await model.find(Reference);
		let qde = 0;
		for (const row of rows) {
			await model.findOneAndDelete({
				_id: row._id,
			});
			qde++;
		}

		return qde ? true : false;
	}

	async isValidId(Id: string): Promise<any> {
		const ObjectId = mongoose.Types.ObjectId;
		try {
			if (!Id) return false;
			if (Id.length != 24) return false;
			if (!ObjectId.isValid(Id)) return true;

			if (String(new ObjectId(Id)) === Id) return true;

			return false;
		} catch (error) {
			return false;
		}
	}
}
