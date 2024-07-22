import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { LogIn, ArrowRight } from "lucide-react";

export default async function Home() {
  const { userId } = auth()
  const userName = userId ? (await clerkClient.users.getUser(userId)).username : ""

  return (
    <main className="w-screen min-h-screen bg-gradient-to-b from-blue-100 via-blue-300 to-blue-500">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center gap-8">

          {/* header */}
          <div className="flex items-center">
            <h1 className="text-5xl font-bold"> Get answers from any PDF! </h1>
          </div>

          {/* user profile */}
          { userName && 
            <div className="flex items-center justify-center gap-2 font-medium text-xl">
              Hello, {userName} <UserButton />
            </div>
          }

          {/* user buttons */}
          { !!userId &&
            <div className="flex gap-8">
              <Button className="flex gap-2 hover:invert"> Go to Chats <ArrowRight /> </Button>
              <Button className="flex gap-2 bg invert hover:invert-0"> Manage Subscription </Button>
            </div>
          }

          {/* intro text */}
          <div className="flex flex-col justify-center gap-2 lg:text-xl">
            <h2 className="font-semibold"> Welcome to PDF QueryBot! </h2>
            <p> Upload your PDF and get instant answers to any questions about its content. Effortlessly find the information you need with our smart chatbot. </p>
          </div>

          {/* user actions based on login */}
          <div className="m-4">
            { !!userId ? <h1> Upload File </h1> :
              <Link href="/sign-in">
                <Button className="flex gap-2"> Login to get started! <LogIn /> </Button>
              </Link>
            }
          </div>
        </div>
        
      </div>
    </main>
  );
}
