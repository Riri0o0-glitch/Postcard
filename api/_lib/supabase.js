export function storageConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

const supabaseHeaders = () => ({
  apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json'
})

async function request(path, options = {}) {
  if (!storageConfigured()) {
    throw new Error('Supabase storage is not configured.')
  }

  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, {
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
