import { currentUser } from "@clerk/nextjs/server";
import { fetchUserSubscription } from "./actions/subscription.actions";

export async function checkSubscription() {
  const user = await currentUser()
  if(!user) return false

  const userSub = await fetchUserSubscription(user.id)
  if(!userSub) return false
  
  const valid = userSub.stripePriceId && (userSub.stripePeriodEnd + (1000 * 3600 * 24) > Date.now())
  return !!valid
}