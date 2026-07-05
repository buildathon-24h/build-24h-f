/** Best-effort extract of assistant text from the gateway / n8n payload. */
export function extractChatReply(data: unknown): string {
  if (typeof data === 'string') return data

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>

    for (const key of [
      'output',
      'text',
      'reply',
      'message',
      'answer',
      'response',
    ]) {
      if (typeof record[key] === 'string') return record[key] as string
    }

    return JSON.stringify(data, null, 2)
  }

  return String(data)
}
