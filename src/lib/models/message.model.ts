import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
  chatId: { type: String, required: true},
  role: { type: String, required: true},
  content: { type: String, required: true},
})

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema)

export default Message