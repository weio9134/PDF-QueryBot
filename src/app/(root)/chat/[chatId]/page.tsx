import PDFViewer from '@/components/PDFViewer'
import SideBar from '@/components/SideBar'
import { fetchAllChat } from '@/lib/actions/chat.actions'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React, { useState } from 'react'

type ChatPageProps = {
  params: {
    chatId: string
  }
}

const ChatPage = async ({ params: { chatId }}: ChatPageProps) => {
  const user = await currentUser()
  if(!user) return redirect('/')
  
  const mongoUser = await fetchUser(user.id)
  if(!mongoUser) return redirect('/')
  
  const chats = await fetchAllChat(mongoUser._id)
  if(!chats) return redirect('/')
  
  // console.log(chats)
  const currentChat = chats.find((chat: { _id: string }) => parseInt(chat._id) === parseInt(chatId))
  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* side bar */}
        <div className="flex-1 max-w-xs">
          <SideBar chats={chats} currentChatId={parseInt(chatId)}/>
        </div>

        {/* pdf viewer */}
        <div className="max-h-screen p-4 overflow-scroll flex-[5]">
          <PDFViewer url={currentChat?.pdfUrl || ''} />
        </div>

        {/* chat log */}
        <div className="flex-[3] border-l-slate-200 border-l-4">
        </div> 
      </div>
    </div>
  )
}

export default ChatPage