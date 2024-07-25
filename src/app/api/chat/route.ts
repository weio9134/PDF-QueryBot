import { createOpenAI } from '@ai-sdk/openai';
import { NextRequest } from 'next/server';
import { streamText } from 'ai';

const openai = createOpenAI({
  compatibility: 'strict',
  apiKey: process.env.OPENAI_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages: messages
    })

    return result.toAIStreamResponse()
  } catch (error) {
    console.error("ERROR CHATTING", error)
    throw error
  }
}