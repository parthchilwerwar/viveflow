"use client"

import React from 'react'

interface TestComponentProps {
  message: string
}

const TestComponent = ({ message }: TestComponentProps) => {
  return (
    <div className="p-4 bg-blue-100 rounded">
      <h2>Test Component</h2>
      <p>{message}</p>
    </div>
  )
}

export default TestComponent 