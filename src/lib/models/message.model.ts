import mongoose, { mongo } from "mongoose"

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true},
  chatId: { type: String, required: true},
  createdAt: { type: Date, default: Date.now },
  role: { type: String, required: true},
  content: { type: String, required: true},
})

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema)

export default Message