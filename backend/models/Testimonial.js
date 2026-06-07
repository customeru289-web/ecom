import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: 'Verified Customer' },
    avatar: { type: String, default: '' },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    comment: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
