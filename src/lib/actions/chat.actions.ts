"use server"
import Chat from "../models/chat.model"
import User from "../models/user.model"
import Message from "../models/message.model"
import { connectToDB } from "../mongoose"

type ChatProp = {
  id: String,
  userId: String,
  pdfName: String,
  pdfUrl: String,
  createdAt: Date,
  fileKey: String
}
export async function createChat({ id, userId, pdfName, pdfUrl, createdAt, fileKey }: ChatProp) {
  try {
    connectToDB()

    // find the user that this chat will belong to
    const user = await User.findOne({ id: userId })
    if(!user) throw new Error("Can't find user")

    // create the new message and save it 
    const createChat = new Chat({ id, userId, pdfName, pdfUrl, createdAt, fileKey })
    const newChat = await createChat.save()

    // push it to the user log
    user.messages.push(newChat._id)
    await user.save()

    return newChat
  } catch (error: any) {
    throw new Error(`Failed to create new chat:\n ${error.message}`)
  }
}

export async function fetchAllChat(userId: String) {
  try {
    connectToDB()

    // find the corresponding user and all of their chat ids and pdfs
    const chats = await User.findOne({ id: userId }).populate({
      path: "chatIds",
      model: Chat,
      select: "id pdfName"
    })

    return chats
  } catch (error: any) {
    throw new Error(`Failed to fetch all chats:\n ${error.message}`)
  }
}

export async function fetchChatById(chatId: string) {
  try {
    connectToDB()

    // find the corresponding chat
    const chat = await Chat.findOne({ id: chatId })

    return chat
  } catch (error: any) {
    throw new Error(`Failed to find chat:\n ${error.message}`)
  }
}