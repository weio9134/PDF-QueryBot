import { createChat } from "@/lib/actions/chat.actions"
import { fetchUser } from "@/lib/actions/user.actions"
import Chat from "@/lib/models/chat.model"
import User from "@/lib/models/user.model"
import { loadS3IntoPinecone } from "@/lib/pinecone"
import { getS3URL } from "@/lib/s3"
import { currentUser } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    // get user
    const user = await currentUser()
    if(!user) {
      console.error('no user')
      return NextResponse.json({ message: 'no user authorized' }, { status: 400 })
    }
    const userInfo = await fetchUser(user.id)
    if(!userInfo) {
      console.error('no user')
      return NextResponse.json({ message: 'no user authorized' }, { status: 400 })
    }
    
    // get pdf file
    const body = await req.json()
    const { fileKey, fileName } = body
    if (!fileKey || !fileName) {
      console.error('missing fileKey or fileName')
      return NextResponse.json({ message: 'missing fileKey or fileName' }, { status: 400 })
    }

    // vectorize pdf
    await loadS3IntoPinecone(fileKey)
    console.log("DONE VECTORIZING")

    // create new chat
    const date = new Date()
    const chat = await createChat({
      userId: userInfo._id, 
      pdfName: fileName, 
      pdfUrl: getS3URL(fileKey), 
      createdAt: date,
      fileKey: fileKey
    })

    return NextResponse.json({
      chatId: chat._id
    }, { status: 200 })
    
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "internal server error at create-chat POST" },
      { status: 500 }
    )
  }
}
