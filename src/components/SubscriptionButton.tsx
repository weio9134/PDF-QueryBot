"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import axios from 'axios'
import { Infinity } from 'lucide-react'

type Props = {
  isPro: boolean
}

const SubscriptionButton = ({ isPro }: Props) => {
  const [loading, setLoading] = useState(false)
  const handleSubscription = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/stripe')
      window.location.href = response.data.url
    } catch (error) {
      console.log("ERROR", error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Button className="flex gap-2 bg invert hover:invert-0" disabled={loading} onClick={handleSubscription}> 
      {isPro ? 
        "Manage Subscription" : 
        <> Get Unlimited Access <Infinity /> </>
      }
    </Button>
  )
}

export default SubscriptionButton