import ChatComponent from '@/components/ChatComponent'
import PDFViewer from '@/components/PDFViewer'
import SideBar from '@/components/SideBar'
import { fetchAllChat, fetchChatById } from '@/lib/actions/chat.actions'
import { checkSubscription } from '@/lib/subscription'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

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

          <div className='w-screen lg:hidden sticky bg-gray-900 top-0 left-0 justify-between text-white font-semibold'>
            <input id="sidebar-checkbox" type='checkbox' className='peer hidden'/>
            <div className='p-4'> 
              <label htmlFor="sidebar-checkbox" className='hover:underline hover:underline-offset-4 hover:cursor-pointer hover:bg-gray-600 rounded-xl py-2 px-4'> 
                Show ChatLogs 
              </label>
            </div>
            <div className="hidden peer-checked:block w-full">
              <SideBar chats={chats} currentChatId={chatId} isPro={isPro} />
            </div>
          </div>
        </div>

        <div className='flex flex-col md:flex-row'>
          {/* pdf viewer */}
          <div className="p-4 overflow-scroll flex-1 md:flex-[5] h-4/5 md:h-screen">
            <PDFViewer url={currentChat.pdfUrl} />
          </div>
          {/* chat log */}
          <div className="flex-1 md:flex-[3] border-l-slate-200 md:border-l-4 md:h-screen h-1/5 px-4 md:px-0">
            <ChatComponent chatId={chatId} name={currentChat.pdfName}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage