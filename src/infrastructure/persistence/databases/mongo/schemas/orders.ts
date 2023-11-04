import mongoose, { Schema } from 'mongoose';

const ordersSchema = new Schema(
	{
		protocol: { type: Number },
		customerId: {
			type: Schema.Types.ObjectId,
			ref: 'Customers',
			index: true,
			sparse: true
		},
		quantity: { type: Number },
		amount: { type: Number },
		status: {
			type: String,
			enum: [
				'DONE',
				'FINISH',
				'IN_PROGRESS',
				'RECEIVE',
				'PAID',
				'CANCELED',
			],
		},
		payment: {
			type: String,
			enum: ['NONE', 'WAITING', 'APPROVED', 'DENIED'],
		},
		name: String,
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
);

ordersSchema.pre('save', async function (next) {
	if (this.isNew || this.isModified('protocol')) {
		const lastOrder = await mongoose
			.model('Orders', ordersSchema)
			.findOne({}, {}, { sort: { protocol: -1 } });

		if (lastOrder?.protocol) {
			this.protocol = lastOrder?.protocol + 1;
		} else {
			this.protocol = 1;
		}
	}

	next();
});

export { ordersSchema };
