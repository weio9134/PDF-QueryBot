import React from 'react'

type PDFProps = {
  url: string
}

const PDFViewer = ({ url }: PDFProps) => {
  return (
    <iframe 
      src={`https://docs.google.com/gview?url=${url}&embedded=true`}
      className='w-full h-full'
    >

    </iframe>
  )
}

export default PDFViewer