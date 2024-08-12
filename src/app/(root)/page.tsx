import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { LogIn, ArrowRight } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { updateUser } from "@/lib/actions/user.actions";
import SubscriptionButton from "@/components/SubscriptionButton";
import { checkSubscription } from "@/lib/subscription";
import { getFirstChat } from "@/lib/actions/chat.actions";
import ChatButton from "@/components/ChatButton";

export default async function Home() {
  const user = await currentUser()
  let name: string | null = null
  let firstChat = null

  if(user) {
    await updateUser(user.id)
    firstChat = await getFirstChat(user.id)
    name = user.fullName
  }
  
  const isPro = await checkSubscription()

  return (
    <main className="w-screen min-h-screen bg-gradient-to-b from-blue-100 via-blue-300 to-blue-500">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center gap-8">
          {/* header */}
          <div className="flex items-center">
            <h1 className="text-5xl font-bold"> Get answers from any PDF! </h1>
          </div>

          {/* user profile */}
          { name && 
            <div className="flex items-center justify-center gap-2 font-medium text-xl">
              Hello, {name} <UserButton />
            </div>
          }

          {/* user buttons */}
          { user 
            ?
            <div className="flex gap-8">
              { firstChat && 
                <Link href={`/chat/${firstChat._id}`}>
                  <ChatButton />
                </Link>
              }
              <SubscriptionButton isPro={isPro} />
            </div> 
            :
            <Link href="/sign-in">
              <Button className="flex gap-2">
                Login to get started! <LogIn /> 
              </Button>
            </Link>
          }

          {/* intro text */}
          <div className="flex flex-col justify-center gap-2 lg:text-xl">
            <h2 className="font-semibold"> Welcome to PDF QueryBot! </h2>
            <p> Upload your PDF and get instant answers to any questions about its content. Effortlessly find the information you need with our smart chatbot. </p>
          </div>

          { user && 
            <div className="w-full ">
              <FileUpload />
            </div>
          }
        </div>
      </div>
    </main>
  );
}
