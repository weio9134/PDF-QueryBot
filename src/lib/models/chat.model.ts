import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true},
  pdfName: { type: String, required: true},
  pdfUrl: { type: String, required: true},
  createdAt: { type: Date, default: Date.now },
  fileKey: { type: String, required: true},
  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Message'
    }
  ]
})

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema)

export default Chat