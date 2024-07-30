import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { MessageCircle, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import SubscriptionButton from './SubscriptionButton'
import TopToggleSide from './TopToggleSide'


type SideBarProp = {
  chats: any[],
  currentChatId: string,
  isPro: boolean
}

function getToggleFunction() {
  let toggle = false;
  return () => {
    toggle = !toggle;
    return toggle;
  }
}

const SideBar = ({ chats, currentChatId, isPro }: SideBarProp) => {
  let toggle = getToggleFunction()
  console.log(toggle())

  return (
    <div className='bg-gray-900 flex flex-row top-0 left-0 justify-between p-4 text-white font-semibold'>
      <div className='px-4 py-2 hover:underline hover:underline-offset-4 hover:cursor-pointer hover:bg-gray-600 rounded-xl'> ChatLogs </div>
      {/* <TopToggleSide toggle={toggle} /> */}
      {/* { toggle ? "hi" : "bye" } */}
      <div >

      </div>

      <div className='flex gap-8 right-0 left-auto items-center'>
        <Link href={'/'}>
          <div className='px-4 py-2 hover:underline hover:underline-offset-4 hover:cursor-pointer hover:bg-gray-600 rounded-xl'> Home </div>
        </Link>
        <Link href={'/'}>
          <div className='px-4 py-2 hover:underline hover:underline-offset-4 hover:cursor-pointer hover:bg-gray-600 rounded-xl'> Source </div>
        </Link>
        <Link href={''}>
          <SubscriptionButton isPro={isPro} />
        </Link>
      </div>
    </div>
  )
}

export default SideBar