import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { MessageCircle, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'


type SideBarProp = {
  chats: any[],
  currentChatId: string
}

const SideBar = ({ chats, currentChatId }: SideBarProp) => {
  return (
    <div className='w-full h-screen p-4 text-gray-200 bg-gray-900'>
      <Link href={'/'}>
        <Button className='w-full border border-dashed border-white'>
          <PlusCircle className='mr-2 w-5 h-5'/> 
          New Chat 
        </Button>
      </Link>

      <div className="flex flex-col gap-2 mt-4">
        { chats.map(chat => (
            <Link key={chat._id} href={`/chat/${chat._id}`}>
              <div className={
                cn('rounded-lg p-3 text-slate-300 flex items-center', 
                {
                  'bg-blue-600 text-white': chat._id.toString() === currentChatId,
                  'hover:text-white': chat._id.toString() !== currentChatId,
                })
              }>
                <MessageCircle className='mr-2'/>
                <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis'> 
                  {chat.pdfName} 
                </p>
              </div>
            </Link>
          )
        )}
      </div>

      <div className="absolute bottom-4 left-4">
        <div className='flex flex-wrap items-center gap-2 text-sm text-slate-300 '>
          <Link href={'/'}> Home </Link>
          <Link href={'/'}> Source </Link>
        </div>
      </div>
    </div>
  )
}

export default SideBar