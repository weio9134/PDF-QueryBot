"use client"
import { uploadToS3 } from '@/lib/s3'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Inbox, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'

const FileUpload = () => {
  const [uploading, setUploading] = useState(false)
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ fileKey, fileName }: { fileKey: String, fileName: String}) => {
      const response = await axios.post('/api/create-chat', { fileKey, fileName })
      return response.data
    }
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: async (files) => {
      const file = files[0]
      
      // limit file size to 10MB
      if(file.size > 10 * 1024 * 1024) {
        toast.error("Please upload files under 10MB")
        return
      }

      try {
        setUploading(true)
        const data = await uploadToS3(file)

        if(!data?.fileKey || !data?.fileName) {
          toast.error("Something went wrong, please try again later")
          return
        }

        mutate(data, {
          onSuccess: (data) => {
            toast.success(data.message)
          },
          onError: (err) => {
            toast.error("Error creating chat, please try again later")
          }
        })
      } catch (error) {
        console.log("ERROR GETTING FILE\n", error)
      } finally {
        setUploading(false)
      }
    }
  })

  return (
    <div className='p-2 bg-white rounded-xl'>
      <div { ...getRootProps({
        className: 'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex flex-col justify-center items-center'
      }) }>
        <input { ...getInputProps() }/>

        { (uploading || isPending) ? (
          <>
            <Loader2 className='h-10 w-10 text-blue-500 animate-spin' />
            <p className='mt-2 text-sm text-slate-400'> Spilling the tea... </p>
          </>
        ) : (
          <>
            <Inbox className='w-10 h-10 text-blue-500'/>
            <p className="mt-2 text-sm text-slate-400"> Drop PDF Here </p>
          </>
        )}
      </div>
    </div>
  )
}

export default FileUpload