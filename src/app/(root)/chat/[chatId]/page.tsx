import ChatComponent from '@/components/ChatComponent'
import PDFViewer from '@/components/PDFViewer'
import SideBar from '@/components/SideBar'
import TopBar from '@/components/TopBar'
import { fetchAllChat, fetchChatById } from '@/lib/actions/chat.actions'
import { checkSubscription } from '@/lib/subscription'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

import Resizable from 'react-resizable-layout'


type ChatPageProps = {
  params: {
    chatId: string
  }
}

const ChatPage = async ({ params: { chatId }}: ChatPageProps) => {
  const user = await currentUser()
  if(!user) return redirect('/')
  
  const chats = await fetchAllChat(user.id)
  if(!chats) return redirect('/')
  
  const currentChat = await fetchChatById(chatId)
  const isPro = await checkSubscription()

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll flex-wrap lg:flex-nowrap">
        {/* side and top bar */}
        <div>
          <div className='flex-1 max-w-xs hidden lg:block'>
            <SideBar chats={chats} currentChatId={chatId} isPro={isPro}/>
          </div>
          {/* <div className='w-screen lg:hidden sticky'>
            <TopBar chats={chats} currentChatId={chatId} isPro={isPro}/>
          </div> */}
        </div>

        <div className='flex flex-row'>
          {/* pdf viewer */}
          <div className="p-4 overflow-scroll flex-[5] resize-x">
            <PDFViewer url={currentChat?.pdfUrl || ''} />
          </div>
          {/* chat log */}
          <div className="flex-[3] border-l-slate-200 border-l-4">
            <ChatComponent chatId={chatId} name={currentChat.pdfName}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage