import { Schema } from 'mongoose';

const orderItemsSchema = new Schema(
	{
		orderId: {
			type: Schema.Types.ObjectId,
			ref: 'Orders',
			index: true,
		},
		productId: {
			type: Schema.Types.ObjectId,
			ref: 'Products',
			index: true,
		},
		price: Number,
		quantity: Number,
		obs: String,
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
);

export { orderItemsSchema };
