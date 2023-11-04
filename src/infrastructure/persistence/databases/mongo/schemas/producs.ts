import { Schema } from 'mongoose';

const producstSchema = new Schema(
	{
		name: String,
		price: Number,
		category: {
			type: String,
			enum: ['ACCOMPANIMENT', 'DESSERT', 'DRINK', 'SNACK'],
		},
		description: String,
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
);

export { producstSchema };
