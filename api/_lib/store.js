const kvUrl = process.env.KV_REST_API_URL
  || process.env.UPSTASH_REDIS_REST_URL
const kvToken = process.env.KV_REST_API_TOKEN
  || process.env.UPSTASH_REDIS_REST_TOKEN

export function storageConfigured() {
  return Boolean(kvUrl && kvToken)
}

async function kvCommand(command, args = []) {
  if (!storageConfigured()) {
    throw new Error('Postmarked storage is not configured.')
  }

  const response = await fetch(`${kvUrl.replace(/\/$/, '')}/${command}/${args.map(encodeURIComponent).join('/')}`, {
    headers: {
      Authorization: `Bearer ${kvToken}`
    }
  })

  if (!response.ok) {
    throw new Error(`Storage request failed: ${response.status}`)
  }

  const data = await response.json()
  if (data.error) throw new Error(data.error)
  return data.result
}

export async function getJson(key, fallback) {
  const value = await kvCommand('get', [key])
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export async function setJson(key, value) {
  await kvCommand('set', [key, JSON.stringify(value)])
}
