import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  id: { type: String, required: true},
  chatIds: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Chat'
    }
  ]
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User