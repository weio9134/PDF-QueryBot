"use client"
import React, { useEffect } from 'react'
import { Input } from './ui/input'
import { Message, useChat } from 'ai/react'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import Messages from './Messages'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type ChatProps = {
  chatId: string
}

const ChatComponent = ({ chatId }: ChatProps) => {
  const { data } = useQuery({
    queryKey: ['Chat', chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>('/api/get-message', { chatId })
      return response.data
    }
  })

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: '/api/chat',
    body: {
      chatId
    },
    initialMessages: data || []
  })

  useEffect(() => {
    const container = document.getElementById('container')
    if(container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      })
    }
    console.log("THIS IS MESSAGES", messages)
  }, [messages])

  return (
    <div className='relative max-h-screen overflow-scroll' id="container">
      {/* header */}
      <div className='sticky top-0 inset-x-0 p-2 bg-white h-fit'>
        <h3 className='text-xl font-bold'> Chat </h3>
      </div>

      {/* message list */}
      <Messages messages={messages} />

      {/* chatting */}
      <form onSubmit={handleSubmit} className='sticky bottom-0 inset-x-0 px-2 py-4 bg-white'>
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder='Ask any question about your PDF'
            className='w-full'
          />
          <Button className='ml-2 bg-blue-600'>
            <Send className='w-4 h-4'/>
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChatComponent