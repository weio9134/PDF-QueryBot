"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'

const SubscriptionButton = () => {
  const [loading, setLoading] = useState(false)
  return (
    <Button className="flex gap-2 hover:invert" disabled={loading} onClick={() => setLoading(!loading)}> 
      Go to Chats <ArrowRight />
    </Button>
  )
}

export default SubscriptionButton