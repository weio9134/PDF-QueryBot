"use client"
import React from 'react'

type Props = {
  toggle: boolean
}

const TopToggleSide = ({ toggle }: Props) => {
  return (
    <div onClick={() => { toggle = !toggle }}>
      Toggle
      { toggle ? "hi" : "bye" }
    </div>
  )
}

export default TopToggleSide