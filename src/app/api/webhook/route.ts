import { createSubscription, updateSubscription } from "@/lib/actions/subscription.actions";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') as string
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    console.log("STRIPE SIGNATURE WEBHOOK ERROR")
    return new NextResponse("webhook error", { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  // bought new sub
  if(event.type === 'checkout.session.completed') {
    const sub = await stripe.subscriptions.retrieve(session.subscription as string)
    if(!session?.metadata?.userId) {
      return new NextResponse("no userId", { status: 400 })
    }

    await createSubscription({
      userId: session.metadata.userId,
      stripeCustomerId: sub.customer as string,
      stripeSubscriptionId: sub.id,
      stripePriceId: sub.items.data[0].price.toString(),
      stripePeriodEnd: sub.current_period_end,
    }) 
  }

  // renewed sub
  if(event.type === 'invoice.payment_succeeded') {
    const sub = await stripe.subscriptions.retrieve(session.subscription as string)
    if(!session?.metadata?.userId) {
      return new NextResponse("no userId", { status: 400 })
    }

    await updateSubscription(session.metadata.userId, sub.items.data[0].price.toString(), sub.current_period_end.toString()) 
  }

  return new NextResponse(null, { status: 200 })
}