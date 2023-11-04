import { Schema } from 'mongoose';

const customerSchema = new Schema(
	{
		name: String,
		mail: String,
		cpf: {
			type: String,
			index: true,
		},
		birthdate: Date,
		subscription: {
			type: String,
		},
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
);

export { customerSchema };
