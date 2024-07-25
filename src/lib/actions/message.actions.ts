"use server"
import Chat from "../models/chat.model"
import Message from "../models/message.model"
import { connectToDB } from "../mongoose"


type MessageProp = {
  chatId: String,
  role: "system" | "user",
  content: String
}
export async function createMessage({ chatId, role, content }: MessageProp) {
  try {
    connectToDB()

    // find the chat that this message will belong to
    const chat = await Chat.findOne({ _id: chatId })
    if(!chat) throw new Error("Can't find chat thread")

    // create the new message and save it 
    const message = new Message({ chatId, role, content })
    const newMessage = await message.save()

    // push it to the chat log
    chat.messages.push(newMessage._id)
    await chat.save()
  } catch (error: any) {
    throw new Error(`Failed to create new message:\n ${error.message}`)
  }
}