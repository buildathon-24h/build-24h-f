'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface SpeakOptions {
  /** Called with the progressively spoken text (for synced captions). */
  onBoundary?: (spokenText: string) => void
  onEnd?: () => void
}

/**
 * Thin wrapper around the browser SpeechSynthesis API used as a stand-in for
 * a real TTS provider (e.g. ElevenLabs). Prefers a Spanish voice when present
 * and emits progressive caption text via `onBoundary`.
 */
export function useSpeech() {
  const [supported, setSupported] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return
    }
    setSupported(true)

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      voiceRef.current =
        voices.find((v) => v.lang.toLowerCase().startsWith('es')) ??
        voices[0] ??
        null
    }

    pickVoice()
    window.speechSynthesis.addEventListener('voiceschanged', pickVoice)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', pickVoice)
      window.speechSynthesis.cancel()
    }
  }, [])

  const cancel = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  const speak = useCallback(
    (text: string, options?: SpeakOptions) => {
      if (!supported || !text.trim()) {
        // No TTS available: emit the full text once so captions still show.
        options?.onBoundary?.(text)
        options?.onEnd?.()
        return
      }
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = voiceRef.current?.lang ?? 'es-ES'
      if (voiceRef.current) utterance.voice = voiceRef.current
      utterance.rate = 1
      utterance.pitch = 1
      utterance.onstart = () => setSpeaking(true)
      utterance.onboundary = (event) => {
        options?.onBoundary?.(text.slice(0, event.charIndex + 1))
      }
      utterance.onend = () => {
        setSpeaking(false)
        options?.onBoundary?.(text)
        options?.onEnd?.()
      }
      utterance.onerror = () => {
        setSpeaking(false)
        options?.onEnd?.()
      }

      window.speechSynthesis.speak(utterance)
    },
    [supported]
  )

  return { supported, speaking, speak, cancel }
}
