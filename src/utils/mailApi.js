const API_URL =
  import.meta.env.VITE_POSTMARKED_API_URL ||
  'https://postmarked-nu.vercel.app/api/mail'

export async function postmarkedRequest(action, body) {
  let response
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...body })
    })
  } catch {
    throw new Error('Could not contact the Postmarked Bureau. Check your connection.')
  }

  const text = await response.text()
  let data = {}
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      throw new Error(`Postmarked returned an invalid response (${response.status}).`)
    }
  }

  if (!response.ok) {
    throw new Error(data.error || `The Postmarked Bureau returned ${response.status}.`)
  }
  if (!text) {
    throw new Error('The Postmarked Bureau returned an empty response.')
  }
  return data
}
