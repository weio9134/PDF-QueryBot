"use server"
import User from "../models/user.model"
import Subscription from "../models/subscription.model"
import { connectToDB } from "../mongoose"

export async function fetchUserSubscription(userId: string) {
  try {
    connectToDB()
    const user = await User.findOne({ id: userId })
    if(!user) throw new Error("Can't find user")

    if(!user.subscriptionId) return null
    
    return await Subscription.findById({ _id: user.subscriptionId })
  } catch (error: any) {
    throw new Error(`Failed to fetch subscriptions:\n ${error.message}`)
  }
}

type SubProp = {
  userId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  stripePriceId: string,
  stripePeriodEnd: number,
}
export async function createSubscription({ userId, stripeCustomerId, stripeSubscriptionId, stripePriceId, stripePeriodEnd }: SubProp) {
  try {
    connectToDB()
    const user = await User.findOne({ id: userId })
    if(!user) throw new Error("Can't find user")
    
    const sub = new Subscription({ userId, stripeCustomerId, stripeSubscriptionId, stripePriceId, stripePeriodEnd })
    const newSub = await sub.save()
    
    user.subscriptionId = newSub._id;
    await user.save()
  } catch (error: any) {
    throw new Error(`Failed to create new subscriptions:\n ${error.message}`)
  }
}


export async function updateSubscription(userId: string, priceId: string, period: string) {
  try {
    connectToDB()
    
    const user = await User.findOne({ id: userId })
    if(!user) throw new Error("Can't find user")
    
    const sub = await Subscription.findById({ _id: user.subscriptionId })
    sub.stripePriceId = priceId
    sub.stripePeriodEnd = period
    await sub.save()
  } catch (error: any) {
    throw new Error(`Failed to update subscriptions:\n ${error.message}`)
  }
}

