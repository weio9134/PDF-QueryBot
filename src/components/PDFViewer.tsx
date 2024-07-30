"use client"
import React, { useEffect } from 'react'

type Props = {
  url: string
}

const PDFViewer = ({ url }: Props) => {
  useEffect(() => {}, [])

  return (
    <>
      <iframe
        src={`https://docs.google.com/gview?url=${url}&embedded=true`}
        className='w-full h-full'
      />
    </>
  )
}

export default PDFViewer