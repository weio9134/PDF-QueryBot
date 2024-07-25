import { getChatMessages } from "@/lib/actions/chat.actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { chatId } = await req.json()
  const list = await getChatMessages(chatId)
  return NextResponse.json(list)
}