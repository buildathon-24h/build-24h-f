'use client'

import { useEffect, useMemo, useRef } from 'react'
import { LockIcon } from 'lucide-react'
import type { Agent } from '@/lib/agents'
import { cn } from '@/lib/utils'
import { AgentOrb } from '@/components/agents/agent-orb'

interface AgentsCarouselProps {
  agents: Agent[]
  selectedId: string
  onSelect: (id: string) => void
  /** Pulses the selected active orb while TTS is playing. */
  speaking?: boolean
}

export function AgentsCarousel({
  agents,
  selectedId,
  onSelect,
  speaking = false,
}: AgentsCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  // Place the active agent in the middle, coming-soon ones flanking the sides.
  const ordered = useMemo(() => {
    const active = agents.filter((a) => a.status === 'active')
    const soon = agents.filter((a) => a.status !== 'active')
    const half = Math.ceil(soon.length / 2)
    return [...soon.slice(0, half), ...active, ...soon.slice(half)]
  }, [agents])

  // Center the active orb on mount.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [])

  return (
    <div
      ref={scrollerRef}
      className="flex items-center justify-center gap-6 overflow-x-auto px-6 py-4 [scrollbar-width:none] sm:gap-10 [&::-webkit-scrollbar]:hidden"
    >
      {ordered.map((agent) => {
        const isSelected = agent.id === selectedId
        const isActive = agent.status === 'active'
        return (
          <button
            key={agent.id}
            ref={isActive ? activeRef : undefined}
            type="button"
            onClick={() => onSelect(agent.id)}
            aria-pressed={isSelected}
            aria-disabled={!isActive}
            className={cn(
              'group flex shrink-0 flex-col items-center gap-2 rounded-3xl p-2 outline-none transition-all duration-300',
              isActive ? 'cursor-pointer' : 'cursor-default',
              isSelected && 'scale-105'
            )}
          >
            <div className="relative">
              <AgentOrb
                gradient={agent.gradient}
                size={isActive ? (isSelected ? 148 : 128) : 72}
                speaking={isSelected && isActive && speaking}
                muted={!isActive}
              />
              {!isActive && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <LockIcon className="size-4 text-white/70" />
                </span>
              )}
              {isSelected && isActive && (
                <span className="absolute -inset-1 rounded-full ring-2 ring-primary/40" />
              )}
            </div>
            <div className="text-center">
              <div
                className={cn(
                  'text-xs font-medium sm:text-sm',
                  isActive ? 'text-foreground' : 'text-muted-foreground/60'
                )}
              >
                {agent.department}
              </div>
              {isActive ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Activo
                </span>
              ) : (
                <span className="text-[10px] text-muted-foreground/50">
                  Coming soon
                </span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
