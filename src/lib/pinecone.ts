import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { convertToAscii } from "./utils";

let pinecone: Pinecone | null = null;

export async function getPinconeClient() {
  if(!pinecone) {
    pinecone = new Pinecone({ apiKey: process.env.PINECONE_KEY! })
  }

  return pinecone
}

export async function loadS3IntoPinecone(fileKey: string) {
  // download and read PDF
  const fileName = await downloadFromS3(fileKey)
  if(!fileName) {
    throw new Error("could not download PDF")
  }
  const loader = new PDFLoader(fileName)
  const pages = await loader.load()

  // segment pdf
  const documents = await Promise.all(pages.map(prepareDocument))

  // vectorization and embedding
  const vectors = await Promise.all(documents.flat().map(embedDcoument))

  // upload to pinecone
  const client = await getPinconeClient()
  const index = client.index('pdf-querybot')
  
  const nameSpace = convertToAscii(fileKey)
  index.namespace(nameSpace).upsert(vectors)
  
}

export function truncateString(str: string, bytes: number) {
  const enc = new TextEncoder()
  return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes))
}

export async function prepareDocument(page: any) {
  let { pageContent, metadata } = page
  pageContent = pageContent.replace(/\n/g, '')

  const splitter = new RecursiveCharacterTextSplitter()
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateString(pageContent, 36000)
      }
    })
  ])

  return docs
}

export async function embedDcoument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent)
    const hash = md5(doc.pageContent)

    const vec = {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber
      }
    } as PineconeRecord

    return vec
  } catch (error) {
    console.log("ERROR EMBEDDING DOCS")
    throw error
  }
}