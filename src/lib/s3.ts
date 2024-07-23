import AWS from "aws-sdk"

export async function uploadToS3(file: File) {
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
    
    const fileKey = 'uploads/' + Date.now().toString() + file.name.replaceAll(' ', '-')

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET!,
      Key: fileKey,
      Body: file
    }

    const upload = s3.putObject(params).on('httpUploadProgress', evt => {
      console.log("uploading...", parseInt((evt.loaded * 100 / evt.total).toString()) + "%")
    }).promise()

    await upload.then(data => {
      console.log("finished uploading")
    })

    return Promise.resolve({
      fileKey,
      file_name: file.name
    })
  } catch (error) {
    
  }
}

export function getS3URL(fileKey: string) {
  return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.us-east-2.amazonaws.com/${fileKey}`
}