"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      
      return (
        <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md text-red-800 dark:text-red-300">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <details className="text-sm">
            <summary className="cursor-pointer mb-2">Show error details</summary>
            <pre className="p-2 bg-red-100 dark:bg-red-950/50 rounded overflow-auto">
              {this.state.error?.toString() || "Unknown error"}
            </pre>
          </details>
          <p className="mt-2 text-sm">
            Please try refreshing the page or contact support if the problem persists.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 