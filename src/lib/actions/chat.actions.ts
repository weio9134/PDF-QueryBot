"use server"
import Chat from "../models/chat.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"

type ChatProp = {
  userId: String,
  pdfName: String,
  pdfUrl: String,
  createdAt: Date,
  fileKey: String
}
export async function createChat({ userId, pdfName, pdfUrl, createdAt, fileKey }: ChatProp) {
  try {
    connectToDB()

    // find the user that this chat will belong to
    const user = await User.findOne({ _id: userId })
    if(!user) throw new Error(`Can't find user ${userId}`)

    // create the new message and save it 
    const createChat = new Chat({ userId, pdfName, pdfUrl, createdAt, fileKey }, { _id: true })
    const newChat = await createChat.save()

    // push it to the user log
    user.chatIds.push(newChat._id)
    await user.save()

    return newChat
  } catch (error: any) {
    throw new Error(`Failed to create new chat:\n ${error.message}`)
  }
}

export async function fetchAllChat(userId: String) {
  try {
    connectToDB()

    // find the corresponding user and all of their chats
    const chats = await User.findOne({ _id: userId }).populate('chatIds');
    if(!chats) throw new Error(`Can't find chats by user ${userId}`)
    
    return chats.chatIds
  } catch (error: any) {
    throw new Error(`Failed to fetch all chats:\n ${error.message}`)
  }
}

export async function fetchChatById(chatId: string) {
  try {
    connectToDB()

    // find the corresponding chat
    const chat = await Chat.findOne({ id: chatId })
    if(!chat) throw new Error(`Can't find chat ${chatId}`)

    return chat
  } catch (error: any) {
    throw new Error(`Failed to find chat:\n ${error.message}`)
  }
}
