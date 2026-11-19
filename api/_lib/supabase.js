export function storageConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

const supabaseHeaders = () => ({
  apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  'Content-Type': 'application/json'
})

function supabaseBaseUrl() {
  return process.env.SUPABASE_URL
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/rest\/v1\/?$/, '')
}

async function request(path, options = {}) {
  if (!storageConfigured()) {
    throw new Error('Supabase storage is not configured.')
  }

  const baseUrl = supabaseBaseUrl()
  let parsed
  try {
    parsed = new URL(baseUrl)
  } catch {
    throw new Error('SUPABASE_URL is not a valid project URL.')
  }
  if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.supabase.co')) {
    throw new Error('SUPABASE_URL must be the HTTPS project URL, for example https://project.supabase.co.')
  }

  const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
    ...options,
    headers: { ...supabaseHeaders(), ...options.headers }
  })

  if (!response.ok) {
    throw new Error(`Storage request failed: ${await response.text()}`)
  }
  if (response.status === 204) return null
  return response.json()
}

export async function findProfile(email) {
  const rows = await request(`profiles?email=eq.${encodeURIComponent(email)}&select=*`)
  return rows[0] || null
}

export async function createProfile(profile) {
  const rows = await request('profiles', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(profile)
  })
  return rows[0]
}

export async function createLetter(letter) {
  await request('letters', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify(letter)
  })
}

export async function getMailbox(email) {
  return request(`letters?recipient_email=eq.${encodeURIComponent(email)}&order=created_at.desc&select=*`)
}
