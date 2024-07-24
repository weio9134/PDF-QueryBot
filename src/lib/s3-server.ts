import AWS from "aws-sdk"
import fs from "fs"
import path from "path"

export async function downloadFromS3(fileKey: string) {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_KEY,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET
    })

    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET
      },
      region: 'us-east-2'
    })

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET!,
      Key: fileKey,
    }

    const obj = await s3.getObject(params).promise()
    
    // ensure the /tmp directory exists
    const tmpDir = path.join(__dirname, 'tmp')
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir)
    }

    const fileName = path.join(tmpDir, `pdf-${Date.now()}.pdf`)
    
    fs.writeFileSync(fileName, obj.Body as Buffer)
    return fileName
  } catch (error) {
    console.error(error)
    return null
  }
}
