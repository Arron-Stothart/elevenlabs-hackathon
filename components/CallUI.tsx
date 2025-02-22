"use client"

import * as React from "react"
import { motion } from "framer-motion"

export default function CallUI() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full flex items-center justify-center bg-background"
    >
      <h1 className="text-2xl font-semibold">Video Call Interface Coming Soon</h1>
    </motion.div>
  )
} 