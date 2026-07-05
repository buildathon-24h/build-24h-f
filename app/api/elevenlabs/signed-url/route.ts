import { NextResponse } from 'next/server'

import { getElevenLabsAgentId } from '@/lib/elevenlabs'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY

    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is not configured')
    }

    const agentId = getElevenLabsAgentId()
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
      {
        headers: {
          'xi-api-key': apiKey,
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to get ElevenLabs signed URL' },
        { status: response.status }
      )
    }

    const body = (await response.json()) as { signed_url?: string }

    if (!body.signed_url) {
      return NextResponse.json(
        { error: 'ElevenLabs response did not include signed_url' },
        { status: 502 }
      )
    }

    return NextResponse.json({ signedUrl: body.signed_url })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to get signed URL'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
