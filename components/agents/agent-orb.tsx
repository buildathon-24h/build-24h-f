'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface AgentOrbProps {
  gradient: [string, string]
  /** Pixel diameter of the orb. */
  size?: number
  /** Animates a stronger pulse to signal the agent is talking. */
  speaking?: boolean
  /** Dims and desaturates orbs that are not selected/available. */
  muted?: boolean
  className?: string
}

// Morphing blob shapes for an abstract, organic feel.
const BLOB_SHAPES = [
  '60% 40% 55% 45% / 55% 60% 40% 45%',
  '45% 55% 40% 60% / 50% 45% 55% 50%',
  '55% 45% 60% 40% / 45% 55% 45% 60%',
  '60% 40% 55% 45% / 55% 60% 40% 45%',
]

export function AgentOrb({
  gradient,
  size = 160,
  speaking = false,
  muted = false,
  className,
}: AgentOrbProps) {
  const [from, to] = gradient

  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      {/* Ambient glow */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${from}, transparent 70%)`,
        }}
        animate={{
          opacity: muted ? 0.12 : speaking ? [0.5, 0.9, 0.5] : [0.35, 0.55, 0.35],
          scale: speaking ? [1, 1.15, 1] : [1, 1.05, 1],
        }}
        transition={{
          duration: speaking ? 1.1 : 3.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />

      {/* Rotating conic accent ring (abstract) */}
      <motion.div
        aria-hidden
        className="absolute inset-[6%] rounded-full opacity-60 blur-md"
        style={{
          background: `conic-gradient(from 0deg, ${from}, ${to}, ${from})`,
          maskImage: 'radial-gradient(circle, transparent 55%, black 72%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 55%, black 72%)',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: speaking ? 8 : 22,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'linear',
        }}
      />

      {/* Core morphing blob */}
      <motion.div
        className="absolute inset-[14%] overflow-hidden"
        style={{
          background: `radial-gradient(circle at 32% 28%, ${from}, ${to} 72%)`,
          boxShadow:
            'inset -8px -12px 24px rgba(0,0,0,0.35), inset 8px 10px 20px rgba(255,255,255,0.25)',
          filter: muted ? 'grayscale(0.7)' : undefined,
          opacity: muted ? 0.55 : 1,
        }}
        animate={{
          borderRadius: BLOB_SHAPES,
          scale: speaking ? [1, 1.05, 0.98, 1.03, 1] : [1, 1.02, 1],
          rotate: [0, 6, 0, -6, 0],
        }}
        transition={{
          duration: speaking ? 3 : 9,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      >
        {/* Specular highlight */}
        <div
          aria-hidden
          className="absolute left-[22%] top-[16%] size-[30%] rounded-full bg-white/50 blur-md"
        />
      </motion.div>
    </div>
  )
}
