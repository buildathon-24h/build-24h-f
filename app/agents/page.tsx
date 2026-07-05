'use client'

import { useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AgentsCarousel } from '@/components/agents/agents-carousel'
import { AgentStage, AgentStageComingSoon } from '@/components/agents/agent-stage'
import { agents, getAgent } from '@/lib/agents'
import { agentAmbientStyle } from '@/lib/agent-gradient'

export default function AgentsPage() {
  const [selectedId, setSelectedId] = useState(
    agents.find((a) => a.status === 'active')?.id ?? agents[0].id
  )
  const [speaking, setSpeaking] = useState(false)
  const selected = getAgent(selectedId) ?? agents[0]

  function handleSelect(id: string) {
    setSpeaking(false)
    setSelectedId(id)
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Agents" />
        <div
          className="relative flex min-h-[calc(100svh-var(--header-height))] flex-1 flex-col transition-[background] duration-700 ease-in-out"
          style={agentAmbientStyle(selected.gradient)}
        >
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
            <AgentsCarousel
              agents={agents}
              selectedId={selectedId}
              onSelect={handleSelect}
              speaking={speaking}
            />
            {selected.status === 'active' ? (
              <AgentStage
                key={selected.id}
                agent={selected}
                onSpeakingChange={setSpeaking}
              />
            ) : (
              <AgentStageComingSoon key={selected.id} agent={selected} />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
