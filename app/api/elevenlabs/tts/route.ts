import { NextResponse } from 'next/server'

import {
  ELEVENLABS_DEFAULT_TTS_MODEL,
  getElevenLabsClient,
  getElevenLabsVoiceId,
} from '@/lib/elevenlabs'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      text?: unknown
      voiceId?: unknown
    }
    const text = typeof body.text === 'string' ? body.text.trim() : ''
    const voiceId =
      typeof body.voiceId === 'string' && body.voiceId.trim()
        ? body.voiceId.trim()
        : getElevenLabsVoiceId()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    const client = getElevenLabsClient()
    const audioStream = await client.textToSpeech.stream(voiceId, {
      text,
      modelId: ELEVENLABS_DEFAULT_TTS_MODEL,
      outputFormat: 'mp3_44100_128',
    })

    return new Response(audioStream, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'audio/mpeg',
      },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to synthesize speech'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
