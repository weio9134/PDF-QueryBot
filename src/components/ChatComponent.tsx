"use client"
import React, { useEffect } from 'react'
import { Input } from './ui/input'
import { Message, useChat } from 'ai/react'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import Messages from './Messages'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Textarea } from './ui/textarea'

type ChatProps = {
  chatId: string,
  name: string
}

const ChatComponent = ({ chatId, name }: ChatProps) => {
  const { data } = useQuery({
    queryKey: ['Chat', chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>('/api/get-message', { chatId })
      return response.data
    }
  })

  const { input, handleInputChange, handleSubmit, messages, isLoading } = useChat({
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
  }, [messages])

  return (
    <div className='relative max-h-screen overflow-scroll' id="container">
      {/* header */}
      <div className='sticky top-0 inset-x-0 p-2 bg-white h-fit text-center text-ellipsis'>
        <h3 className='text-xl font-bold underline underline-offset-4 '> 
          Chatting about {name}
        </h3>
      </div>

      {/* message list */}
      <div className='p-1'>
        <Messages messages={messages} loading={isLoading} />
      </div>

      {/* chatting */}
      <form onSubmit={handleSubmit} className='sticky bottom-0 inset-x-0 px-2 py-4 bg-white'>
        <div className="flex items-center">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder='Ask any question about your PDF'
            className='w-full'
            contentEditable="plaintext-only"
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