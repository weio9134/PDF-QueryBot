"use client"
import React, { useEffect, useState } from 'react'

type Props = {
  url: string
}

const PDFViewer = ({ url }: Props) => {
  const [pdfUrl, setPdfUrl] = useState('')
  useEffect(() => {
    setPdfUrl(`https://docs.google.com/gview?url=${url}&embedded=true`)
  }, [url])

  return (
    <>
      <iframe
        key={pdfUrl}
        src={pdfUrl}
        className='w-full h-full'
      />
    </>
  )
}

export default PDFViewer