import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { LogIn, ArrowRight } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { updateUser } from "@/lib/actions/user.actions";

export default async function Home() {
  const user = await currentUser();
  const name = user?.fullName
  if(user) {
    await updateUser(user.id)
  }
  
  // const userName = userId ? (await clerkClient().users.getUser(userId)).username : ""

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
              <Link href={'/chat/0'}>
                <Button className="flex gap-2 hover:invert"> 
                  Go to Chats <ArrowRight /> 
                </Button>
              </Link>
              <Button className="flex gap-2 bg invert hover:invert-0"> Manage Subscription </Button>
            </div> 
            :
            <Link href="/sign-in">
              <Button className="flex gap-2"> Login to get started! <LogIn /> </Button>
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
