const API_URL = import.meta.env.VITE_POSTMARKED_API_URL || '/api/mail'

export async function postmarkedRequest(action, body) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...body })
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || 'The Postmarked Bureau is unavailable.')
  }
  return data
}
