import mongoose, { Schema } from 'mongoose';
import { ordersSchema } from './orders';

const paymentsSchema = new Schema(
	{
		orderId: {
			type: Schema.Types.ObjectId,
			ref: 'Orders',
			index: true,
		},
		broker: String,
		status: {
			type: String,
			enum: ['WAITING', 'APPROVED', 'DENIED'],
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

paymentsSchema
	.post('save', async function (object) {
		const lastOrder = await mongoose
			.model('Orders', ordersSchema)
			.findByIdAndUpdate(
				object.orderId,
				{
					payment: object.status,
				},
				{
					new: true,
				}
			);
	})
	.post('findOneAndUpdate', async function (object) {
		const lastOrder = await mongoose
			.model('Orders', ordersSchema)
			.findByIdAndUpdate(
				object.orderId,
				{
					payment: object.status,
				},
				{
					new: true,
				}
			);
	});

export { paymentsSchema };
