import { getEmbeddings } from "./embeddings";
import { getPinconeClient } from "./pinecone";
import { convertToAscii } from "./utils";


export async function getMatchesFromEmbeds(embeds: number[], fileKey: string) {
  try {
    const client = await getPinconeClient()
    const index = client.index('pdf-querybot')

    const namespace = convertToAscii(fileKey)
    const result = await index.namespace(namespace).query({
      vector: embeds,
      topK: 5,
      includeMetadata: true,
    })

    return result.matches || []
  } catch (error) {
    console.log("ERROR QUERY EMBEDDINGS")
    throw error
  }
}

type MetaData = {
  text: string,
  pageNumber: number
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeds = await getEmbeddings(query)
  const matches = await getMatchesFromEmbeds(queryEmbeds, fileKey)

  const valid = matches.filter(match => match.score && match.score > 0.7)
  const docs = valid.map(match => (match.metadata as MetaData).text)

  return docs.join("\n").substring(0, 3000)
}