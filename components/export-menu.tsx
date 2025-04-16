"use client"

import React, { useState } from 'react'
import html2canvas from 'html2canvas'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Download, Image, FileImage, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExportMenuProps {
  elementId: string
  filename?: string
}

export default function ExportMenu({ elementId, filename = 'framework' }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const captureElement = async () => {
    const element = document.getElementById(elementId)
    if (!element) {
      toast({
        title: "Export failed",
        description: "Could not find the element to export",
        variant: "destructive",
      })
      return null
    }

    try {
      // Add a class to improve rendering quality
      element.classList.add('export-target')
      const canvas = await html2canvas(element, {
        scale: 2, // Increase quality
        useCORS: true,
        logging: false,
        backgroundColor: '#020617', // Dark background matching slate-950
      })
      element.classList.remove('export-target')
      return canvas
    } catch (error) {
      console.error('Error capturing element:', error)
      toast({
        title: "Export failed",
        description: "An error occurred while capturing the content",
        variant: "destructive",
      })
      return null
    }
  }

  const exportAsPNG = async () => {
    setIsExporting(true)
    try {
      const canvas = await captureElement()
      if (!canvas) {
        setIsExporting(false)
        return
      }

      const imgData = canvas.toDataURL('image/png')
      
      // Create a download link and trigger it
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = imgData
      link.click()
      
      toast({
        title: "Export successful",
        description: "Your framework has been exported as PNG",
      })
    } catch (error) {
      console.error('Error exporting PNG:', error)
      toast({
        title: "Export failed",
        description: "An error occurred while generating the PNG",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsJPG = async () => {
    setIsExporting(true)
    try {
      const canvas = await captureElement()
      if (!canvas) {
        setIsExporting(false)
        return
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.9) // 0.9 quality
      
      // Create a download link and trigger it
      const link = document.createElement('a')
      link.download = `${filename}.jpg`
      link.href = imgData
      link.click()
      
      toast({
        title: "Export successful",
        description: "Your framework has been exported as JPG",
      })
    } catch (error) {
      console.error('Error exporting JPG:', error)
      toast({
        title: "Export failed",
        description: "An error occurred while generating the JPG",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsSVG = async () => {
    setIsExporting(true)
    try {
      // For SVG export, we need to capture all the relevant SVG elements
      const element = document.getElementById(elementId)
      if (!element) {
        toast({
          title: "Export failed",
          description: "Could not find the element to export",
          variant: "destructive",
        })
        setIsExporting(false)
        return
      }

      // Find all SVG elements in the target
      const svgElements = element.querySelectorAll('svg')
      if (svgElements.length === 0) {
        toast({
          title: "Export failed",
          description: "No SVG elements found in the framework",
          variant: "destructive",
        })
        setIsExporting(false)
        return
      }

      // For simplicity, we'll export the first SVG (you could modify this to merge all SVGs if needed)
      const svgElement = svgElements[0]
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const svgUrl = URL.createObjectURL(svgBlob)
      
      // Create a download link and trigger it
      const link = document.createElement('a')
      link.download = `${filename}.svg`
      link.href = svgUrl
      link.click()
      
      // Clean up
      URL.revokeObjectURL(svgUrl)
      
      toast({
        title: "Export successful",
        description: "Your framework has been exported as SVG",
      })
    } catch (error) {
      console.error('Error exporting SVG:', error)
      toast({
        title: "Export failed",
        description: "An error occurred while generating the SVG",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-gray-700 bg-white text-black hover:bg-gray-200 text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-4 w-full sm:w-auto">
          <Download size={16} className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span>Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white min-w-[150px] sm:min-w-[180px]">
        <DropdownMenuLabel className="text-xs sm:text-sm">Choose Format</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          onClick={exportAsPNG} 
          disabled={isExporting} 
          className="hover:bg-blue-900/30 focus:bg-blue-900/30 cursor-pointer text-xs sm:text-sm py-1 sm:py-2"
        >
          <FileImage size={14} className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Export as PNG
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={exportAsJPG} 
          disabled={isExporting} 
          className="hover:bg-blue-900/30 focus:bg-blue-900/30 cursor-pointer text-xs sm:text-sm py-1 sm:py-2"
        >
          <FileImage size={14} className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Export as JPG
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={exportAsSVG} 
          disabled={isExporting} 
          className="hover:bg-blue-900/30 focus:bg-blue-900/30 cursor-pointer text-xs sm:text-sm py-1 sm:py-2"
        >
          <FileText size={14} className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Export as SVG
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 