import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'

export const ELEVENLABS_DEFAULT_TTS_MODEL =
  process.env.ELEVENLABS_TTS_MODEL_ID ?? 'eleven_multilingual_v2'

export function getElevenLabsSttModelId() {
  return process.env.ELEVENLABS_STT_MODEL_ID === 'scribe_v1'
    ? 'scribe_v1'
    : 'scribe_v2'
}

export function getElevenLabsClient() {
  const apiKey = process.env.ELEVENLABS_API_KEY

  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY is not configured')
  }

  return new ElevenLabsClient({ apiKey })
}

export function getElevenLabsVoiceId() {
  const voiceId = process.env.ELEVENLABS_VOICE_ID

  if (!voiceId) {
    throw new Error('ELEVENLABS_VOICE_ID is not configured')
  }

  return voiceId
}

export function getElevenLabsAgentId() {
  const agentId = process.env.ELEVENLABS_AGENT_ID

  if (!agentId) {
    throw new Error('ELEVENLABS_AGENT_ID is not configured')
  }

  return agentId
}
