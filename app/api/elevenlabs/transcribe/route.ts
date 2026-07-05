import { NextResponse } from 'next/server'

import {
  getElevenLabsClient,
  getElevenLabsSttModelId,
} from '@/lib/elevenlabs'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('audio')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 })
    }

    const languageCode = formData.get('languageCode')
    const client = getElevenLabsClient()
    const result = await client.speechToText.convert({
      file,
      modelId: getElevenLabsSttModelId(),
      ...(typeof languageCode === 'string' && languageCode.trim()
        ? { languageCode: languageCode.trim() }
        : {}),
    })

    return NextResponse.json({
      transcript: result.text,
      languageCode: result.languageCode,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to transcribe audio'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
