import { Schema } from 'mongoose';

const productImagesSchema = new Schema(
	{
		productId: {
			type: Schema.Types.ObjectId,
			ref: 'Products',
			index: true,
		},
		name: String,
		size: Number,
		type: String,
		base64: String,
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
);

export { productImagesSchema };
