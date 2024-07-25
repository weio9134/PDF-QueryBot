"use client"
import React from 'react'
import { Input } from './ui/input'
import { useChat } from 'ai/react'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import Messages from './Messages'

type ChatProps = {}

const ChatComponent = (props: ChatProps) => {
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: '/api/chat'
  })

  return (
    <div className='relative max-h-screen overflow-scroll'>
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