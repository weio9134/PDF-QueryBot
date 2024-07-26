"use server"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"


export async function updateUser(id: string): Promise<void> {
  try {
    connectToDB()
    const user = await User.findOneAndUpdate({ id: id })

    if(!user) {
      await User.create({
        id: id,
        chatIds: [],
        subscriptionIds: [],
      })
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user:\n ${error.message}`)
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB()

    const user = await User.findOne({ id: userId })
    return user
  } catch (error: any) {
    throw new Error(`Failed to find user:\n ${error.message}`)
  }
}
