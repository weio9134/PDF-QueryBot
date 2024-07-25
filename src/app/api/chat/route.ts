import { createOpenAI } from '@ai-sdk/openai';
import { NextRequest } from 'next/server';
import { Message, streamText } from 'ai';
import { getContext } from '@/lib/context';
import Chat from '@/lib/models/chat.model';
import { createMessage } from '@/lib/actions/message.actions';

const openai = createOpenAI({
  compatibility: 'strict',
  apiKey: process.env.OPENAI_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages, chatId } = await req.json()
    const lastMessage = messages[messages.length - 1].content

    // add user message to db
    await createMessage({
      chatId: chatId,
      role: 'user',
      content: lastMessage
    })

    // extract vectorized context
    const chat = await Chat.findById({ _id: chatId })
    const context  = await getContext(lastMessage, chat.fileKey)

    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      `,
    }

    // feed in the prompt and save AI message back to db
    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages: [
        prompt, ...messages.filter((message: Message) => message.role === 'user')
      ],
      onFinish: async (completion) => {
        await createMessage({
          chatId: chatId,
          role: 'system',
          content: completion.text
        })
      }
    })

    return result.toAIStreamResponse()
  } catch (error) {
    console.error("ERROR CHATTING", error)
    throw error
  }
}