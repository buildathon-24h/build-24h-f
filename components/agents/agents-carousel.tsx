'use client'

import { useEffect, useMemo, useRef } from 'react'
import type { Agent } from '@/lib/agents'
import { cn } from '@/lib/utils'
import { Orb, type AgentState } from '@/components/orbs/orb'

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
  const selectedRef = useRef<HTMLButtonElement>(null)

  // Place the active agent in the middle, coming-soon ones flanking the sides.
  const ordered = useMemo(() => {
    const active = agents.filter((a) => a.status === 'active')
    const soon = agents.filter((a) => a.status !== 'active')
    const half = Math.ceil(soon.length / 2)
    return [...soon.slice(0, half), ...active, ...soon.slice(half)]
  }, [agents])

  // Keep the selected orb centered as users preview departments.
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [selectedId])

  return (
    <div
      ref={scrollerRef}
      className="flex items-center justify-center gap-3 overflow-x-auto px-3 py-4 [scrollbar-width:none] sm:gap-5 lg:gap-7 [&::-webkit-scrollbar]:hidden"
    >
      {ordered.map((agent) => {
        const isSelected = agent.id === selectedId
        const isActive = agent.status === 'active'
        return (
          <button
            key={agent.id}
            ref={isSelected ? selectedRef : undefined}
            type="button"
            onClick={() => onSelect(agent.id)}
            aria-pressed={isSelected}
            className={cn(
              'group flex shrink-0 flex-col items-center gap-2 rounded-3xl p-2 outline-none transition-colors duration-300',
              'cursor-pointer'
            )}
          >
            <div className="relative">
              <div
                className={cn(
                  'relative transition-opacity duration-300',
                  isSelected ? 'opacity-100' : 'opacity-65'
                )}
                style={{ width: isSelected ? 148 : 82, height: isSelected ? 148 : 82 }}
              >
                <Orb
                  className="h-full w-full"
                  colors={agent.gradient}
                  resizeDebounce={200}
                  agentState={
                    isSelected && speaking ? ('talking' as AgentState) : null
                  }
                />
              </div>
              {isSelected && (
                <span className="absolute -inset-1 rounded-full ring-2 ring-primary/40" />
              )}
            </div>
            <div className="text-center">
              <div
                className={cn(
                  'text-xs font-medium sm:text-sm',
                  isSelected ? 'text-foreground' : 'text-muted-foreground/60'
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
