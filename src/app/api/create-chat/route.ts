import { NextResponse } from "next/server"

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json()
    const { fileKey, fileName } = body
    return NextResponse.json({ message: "success" })
  } catch (error) {
    console.log("ERROR", error)
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500}
    )
  }
}