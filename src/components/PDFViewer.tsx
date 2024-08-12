"use client"
import React, { useEffect, useState } from 'react'

type Props = {
  url: string
}

const PDFViewer = ({ url }: Props) => {
  const [pdf, setPDF] = useState('')
  useEffect(() => setPDF(`https://docs.google.com/gview?url=${url}&embedded=true`), [url])

  return (
    <>
      <iframe
        src={pdf}
        className='w-full h-full'
      />
    </>
  )
}

export default PDFViewer