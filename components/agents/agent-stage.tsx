'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChatStatus } from 'ai'
import { MessageSquareTextIcon, AudioLinesIcon, LockIcon } from 'lucide-react'
import type { Agent } from '@/lib/agents'
import { getMockReply, streamMockReply } from '@/lib/mock-replies'
import { useSpeech } from '@/hooks/use-speech'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message'
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input'

type Mode = 'text' | 'voice'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function AgentStage({
  agent,
  onSpeakingChange,
}: {
  agent: Agent
  onSpeakingChange?: (speaking: boolean) => void
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [status, setStatus] = useState<ChatStatus>('ready')
  const [mode, setMode] = useState<Mode>('text')
  const [caption, setCaption] = useState('')
  const abortRef = useRef<AbortController | null>(null)
  const { supported, speaking, speak, cancel } = useSpeech()

  const isVoice = mode === 'voice'
  const isBusy = status === 'submitted' || status === 'streaming'

  useEffect(
    () => () => {
      abortRef.current?.abort()
      cancel()
    },
    [cancel]
  )

  useEffect(() => {
    onSpeakingChange?.(speaking)
  }, [speaking, onSpeakingChange])

  useEffect(
    () => () => onSpeakingChange?.(false),
    [onSpeakingChange]
  )

  const runTextStream = useCallback(async (reply: string) => {
    const assistantId = crypto.randomUUID()
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '' },
    ])
    setStatus('streaming')

    const controller = new AbortController()
    abortRef.current = controller

    await streamMockReply(
      reply,
      (partial) =>
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: partial } : m
          )
        ),
      controller.signal
    )
    setStatus('ready')
  }, [])

  const runVoiceReply = useCallback(
    (reply: string) => {
      setCaption('')
      setStatus('streaming')
      speak(reply, {
        onBoundary: (spoken) => setCaption(spoken),
        onEnd: () => {
          setCaption(reply)
          setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role: 'assistant', content: reply },
          ])
          setStatus('ready')
        },
      })
    },
    [speak]
  )

  const handleSubmit = useCallback(
    async (message: PromptInputMessage) => {
      const prompt = message.text?.trim()
      if (!prompt || isBusy) return

      abortRef.current?.abort()
      cancel()

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'user', content: prompt },
      ])
      setStatus('submitted')

      const reply = getMockReply(agent, prompt)
      if (isVoice) {
        runVoiceReply(reply)
      } else {
        await runTextStream(reply)
      }
    },
    [agent, isVoice, isBusy, cancel, runTextStream, runVoiceReply]
  )

  function switchMode(next: Mode) {
    if (next === mode) return
    abortRef.current?.abort()
    cancel()
    setCaption('')
    setMode(next)
  }

  return (
    <div className="flex w-full flex-col gap-5">
      {/* Compact header + mode toggle */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <h2 className="text-sm font-semibold">{agent.department}</h2>
            <Badge variant="secondary" className="text-[10px]">
              Activo
            </Badge>
            {isVoice && speaking && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                Hablando
              </span>
            )}
          </div>
        </div>

        <div className="inline-flex rounded-full border border-border/60 bg-background/50 p-1 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => switchMode('text')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              !isVoice
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <MessageSquareTextIcon className="size-4" />
            Texto
          </button>
          <button
            type="button"
            onClick={() => switchMode('voice')}
            disabled={!supported}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-40',
              isVoice
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            title={
              supported ? undefined : 'Tu navegador no soporta síntesis de voz'
            }
          >
            <AudioLinesIcon className="size-4" />
            Voz
          </button>
        </div>
      </div>

      {/* Main content area */}
      {isVoice ? (
        <div className="flex min-h-[38vh] w-full flex-col items-center justify-center px-2">
          <div className="w-full max-w-lg rounded-2xl border border-border/50 bg-background/40 p-5 text-center text-sm leading-relaxed backdrop-blur-sm">
            {caption ? (
              <span>{caption}</span>
            ) : (
              <span className="text-muted-foreground">
                {isBusy ? 'Pensando...' : 'Los subtítulos aparecen acá.'}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex min-h-[38vh] w-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-background/30 backdrop-blur-sm">
          <Conversation className="min-h-[38vh]">
            <ConversationContent className="min-h-[32vh]">
              {messages.map((m) => (
                <Message key={m.id} from={m.role}>
                  <MessageContent>
                    {m.role === 'assistant' ? (
                      <MessageResponse>{m.content}</MessageResponse>
                    ) : (
                      m.content
                    )}
                  </MessageContent>
                </Message>
              ))}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>
      )}

      {/* Suggestions */}
      {messages.length === 0 && !isBusy && agent.suggestions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {agent.suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="rounded-full border-border/60 bg-background/50 backdrop-blur-sm"
              onClick={() => handleSubmit({ text: suggestion, files: [] })}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}

      <PromptInput onSubmit={handleSubmit} className="w-full">
        <PromptInputBody>
          <PromptInputTextarea
            placeholder={`Escribile a ${agent.department}...`}
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <span className="px-1 text-xs text-muted-foreground">
              {isVoice ? 'Respuesta hablada + subtítulos' : 'Respuesta en texto'}
            </span>
          </PromptInputTools>
          <PromptInputSubmit status={status} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}

/** Placeholder stage for departments not yet enabled. */
export function AgentStageComingSoon({ agent }: { agent: Agent }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-muted-foreground">
          {agent.department}
        </h2>
        <Badge variant="outline">
          <LockIcon className="mr-1 size-3" />
          Coming soon
        </Badge>
      </div>
      <p className="max-w-md text-sm text-muted-foreground">
        Este agente estará disponible pronto. Por ahora, probá con Recursos
        Humanos.
      </p>
    </div>
  )
}
