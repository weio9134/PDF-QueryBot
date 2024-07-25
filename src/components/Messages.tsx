import { cn } from '@/lib/utils'
import { Message } from 'ai/react'
import React from 'react'

type MessageProps = {
  messages: Message[]
}

const Messages = ({ messages }: MessageProps) => {
  if(!messages) return (<></>)

  return (
    <div className="flex flex-col gap-2 px-4">
      { messages.map(message => (
        <div 
          key={message.id} 
          className={cn('flex', {
            'justify-end': message.role === 'user',
            'justify-start': message.role === 'assistant'
          })}
        >
          <div className={cn('rounded-lg px-3 text-sm py-1 showdow-md ring-1 ring-gray-900/10', {
            'bg-blue-600 text-white': message.role === 'user',
          })}>
            <p> {message.content} </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Messages