import { fetchUserSubscription } from "@/lib/actions/subscription.actions"
import { stripe } from "@/lib/stripe"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await currentUser()
    if(!user) return new NextResponse("unauthorized", { status: 401 })
    
    const sub = await fetchUserSubscription(user.id)

    // already have subscription
    if(sub && sub.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: sub.stripeCustomerId,
        return_url: process.env.NEXT_BASE_URL
      })

      return NextResponse.json({ url: stripeSession.url })
    }

    // first subscription
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: process.env.NEXT_BASE_URL,
      cancel_url: process.env.NEXT_BASE_URL,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: user?.emailAddresses[0].emailAddress,
      line_items: [{
          price_data: {
            currency: 'USD',
            product_data: {
              name: 'PDF QueryBot Pro',
              description: 'Unlimited PDF query sessions'
            },
            unit_amount: 2000,
            recurring: {
              interval: 'month'
            }
          },
          quantity: 1
      }],
      metadata: {
        userId: user.id
      }
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.log("ERROR GETTING STRIPE")
    throw error
  }
}