import { cn } from '@/lib/utils'
import { Message } from 'ai/react'
import { Loader2 } from 'lucide-react'
import React from 'react'

type MessageProps = {
  messages: Message[],
  loading: boolean
}

const Messages = ({ messages, loading }: MessageProps) => {
  if(!messages) return (<></>)

  return (
    <div className="flex flex-col gap-2 px-4">
      { messages.map((message: any) => (
        <div 
          key={message.id} 
          className={cn('flex', {
            'justify-end': message.role === 'user',
            'justify-start': message.role === 'system'
          })}
        >
          <div className={cn('rounded-lg px-3 text-sm py-1 showdow-md ring-1 ring-gray-900/10', {
            'bg-blue-600 text-white': message.role === 'user',
            'bg-slate-200': message.role === 'system'
          })}>
            <p> {message.content} </p>
          </div>
        </div>
      ))}
      { loading && 
        <div className='justify-start'>
          <Loader2 className='h-9 w-9 text-blue-500 animate-spin' />
        </div>
      }
    </div>
  )
}

export default Messages