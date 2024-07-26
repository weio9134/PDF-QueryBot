import mongoose from "mongoose"

const subscriptionSchema = new mongoose.Schema({
  userId: { type: String, required: true},
  stripeCustomerId: { type: String, required: true},
  stripeSubscriptionId: { type: String, required: true},
  stripePriceId: { type: String, required: true},
  stripePeriodEnd: { type: Number, required: true},
})

const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema)

export default Subscription