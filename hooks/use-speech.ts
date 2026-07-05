'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface SpeakOptions {
  /** Called with the progressively spoken text (for synced captions). */
  onBoundary?: (spokenText: string) => void
  onEnd?: () => void
}

/**
 * ElevenLabs-backed TTS hook. The browser only receives generated audio; the
 * API key stays server-side in `/api/elevenlabs/tts`.
 */
export function useSpeech() {
  const [speaking, setSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const cleanupAudio = useCallback(() => {
    audioRef.current?.pause()
    audioRef.current = null

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      cleanupAudio()
    }
  }, [cleanupAudio])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    cleanupAudio()
    setSpeaking(false)
  }, [cleanupAudio])

  const speak = useCallback(
    async (text: string, options?: SpeakOptions) => {
      const trimmed = text.trim()

      if (!trimmed) {
        options?.onBoundary?.(text)
        options?.onEnd?.()
        return
      }

      cancel()

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const response = await fetch('/api/elevenlabs/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: trimmed }),
          signal: controller.signal,
        })

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as {
            error?: string
          } | null
          throw new Error(payload?.error ?? 'No se pudo generar audio')
        }

        const blob = await response.blob()
        const objectUrl = URL.createObjectURL(blob)
        const audio = new Audio(objectUrl)

        objectUrlRef.current = objectUrl
        audioRef.current = audio

        audio.onplay = () => {
          setSpeaking(true)
          options?.onBoundary?.(trimmed)
        }
        audio.onended = () => {
          setSpeaking(false)
          cleanupAudio()
          options?.onBoundary?.(trimmed)
          options?.onEnd?.()
        }
        audio.onerror = () => {
          setSpeaking(false)
          cleanupAudio()
          options?.onEnd?.()
        }

        await audio.play()
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          options?.onEnd?.()
        }
        setSpeaking(false)
      }
    },
    [cancel, cleanupAudio]
  )

  return { supported: true, speaking, speak, cancel }
}
