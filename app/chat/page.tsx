'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, Loader2, Bot, User } from 'lucide-react'
import { toast } from 'sonner'
import { sendChat, ApiError } from '@/lib/api'
import { extractChatReply } from '@/lib/chat-response'
import { Button, buttonVariants } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  async function handleSend() {
    const prompt = input.trim()
    if (!prompt || sending) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setSending(true)

    try {
      const data = await sendChat(prompt)
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: extractChatReply(data),
        },
      ])
    } catch (error) {
      // 401 is handled globally (sign-out + redirect); surface everything else.
      if (!(error instanceof ApiError && error.status === 401)) {
        const message =
          error instanceof Error ? error.message : 'No se pudo enviar el mensaje'
        toast.error(message)
      }
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-muted/30">
      <header className="flex items-center gap-3 border-b bg-background px-4 py-3">
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }))}
          aria-label="Volver al panel"
        >
          <ArrowLeft />
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bot className="size-4" />
          </div>
          <span className="text-sm font-medium">Asistente Knowly</span>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.length === 0 && (
            <div className="mt-20 text-center text-sm text-muted-foreground">
              Escribí un mensaje para empezar la conversación.
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <div
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-xl',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {message.role === 'user' ? (
                  <User className="size-4" />
                ) : (
                  <Bot className="size-4" />
                )}
              </div>
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border'
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Bot className="size-4" />
              </div>
              <div className="flex items-center rounded-2xl border bg-background px-4 py-2">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t bg-background p-4">
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribí tu mensaje..."
            rows={1}
            className="max-h-40 min-h-10 resize-none"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={sending || !input.trim()}
          >
            {sending ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </div>
      </div>
    </div>
  )
}
