import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderNumber: { type: String, unique: true },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, enum: ['cod', 'stripe'] },
    paymentResult: {
      id: String,
      status: String,
      email: String,
    },
    itemsPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    couponDiscount: { type: Number, default: 0 },
    couponCode: { type: String, default: '' },
    totalPrice: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    trackingNumber: { type: String, default: '' },
    trackingStatus: {
      type: String,
      enum: ['not_shipped', 'in_transit', 'out_for_delivery', 'delivered'],
      default: 'not_shipped',
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

orderSchema.pre('save', async function () {
  if (!this.orderNumber) {
    this.orderNumber = `LX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
