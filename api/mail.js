import { randomBytes, timingSafeEqual, scryptSync } from 'node:crypto'
import { getJson, setJson, storageConfigured } from './_lib/store.js'

function json(res, status, body) {
  res.status(status).json(body)
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const digest = scryptSync(password, salt, 64).toString('hex')
  return `scrypt:${salt}:${digest}`
}

function verifyPassword(password, stored) {
  const [kind, salt, digest] = String(stored || '').split(':')
  if (kind !== 'scrypt' || !salt || !digest) return false
  const calculated = scryptSync(password, salt, 64)
  const expected = Buffer.from(digest, 'hex')
  return calculated.length === expected.length && timingSafeEqual(calculated, expected)
}

async function sendResendEmail(letter) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured.')

  const from = process.env.POSTMARKED_FROM || 'Postmarked <postmarked@postmarked.letters>'
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [letter.recipientEmail],
      subject: letter.subject,
      html: `
        <div style="font-family:Georgia,serif;color:#302820;max-width:680px;line-height:1.7">
          <p><strong>From:</strong> ${letter.sender}</p>
          <p><strong>Postmarked via:</strong> ${letter.senderAddress || 'Postmarked Bureau'}</p>
          <hr style="border:0;border-top:1px solid #d6c4ad">
          <div style="white-space:pre-wrap">${String(letter.body || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          ${letter.signature ? `<p>— ${letter.signature}</p>` : ''}
        </div>
      `
    })
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Email delivery failed: ${detail}`)
  }
}

export default async function handler(req, res) {
  if (!storageConfigured()) {
    return json(res, 503, { error: 'Postmarked storage is not configured.' })
  }

  const action = req.method === 'POST' ? req.body?.action : req.query.action

  try {
    if (req.method === 'POST' && action === 'register') {
      const { name, email, password, address, sealColor, sealEmblem } = req.body
      const normalizedEmail = normalizeEmail(email)
      if (!name || !normalizedEmail || !password || password.length < 6) {
        return json(res, 400, { error: 'Name, email, and a 6-character password are required.' })
      }

      const registry = await getJson('postmarked:registry', {})
      if (registry[normalizedEmail]) {
        return json(res, 409, { error: 'That postal email is already registered.' })
      }

      const account = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        address: address || 'No. 1 Post Restante, Camden',
        sealColor: sealColor || '#743D45',
        sealEmblem: sealEmblem || name.trim().charAt(0).toUpperCase(),
        passwordHash: hashPassword(password)
      }
      registry[normalizedEmail] = account
      await setJson('postmarked:registry', registry)

      const welcome = {
        id: `missive-welcome-${Date.now()}`,
        sender: 'POSTMARKED (Chief Postmaster)',
        senderAddress: 'The Central Bureau of Letters, No. 1 Old Post Office Court',
        recipient: account.name,
        recipientAddress: account.address,
        recipientEmail: normalizedEmail,
        subject: 'Welcome to Postmarked — Your writing desk awaits',
        date: new Date().toISOString(),
        postmark: 'POSTMARKED BUREAU • FIRST DISPATCH',
        sealColor: '#743D45',
        sealEmblem: 'P',
        status: 'inbox',
        unread: true,
        isKeepsake: true,
        body: `Dearest ${account.name},\n\nWelcome to Postmarked. This is your first sealed missive from the Chief Postmaster.\n\nYou can now write, seal, send, and receive letters from companions anywhere in the world.\n\nFaithfully yours,\nThe Chief Postmaster\nPOSTMARKED BUREAU`
      }
      const mailbox = await getJson(`postmarked:mailbox:${normalizedEmail}`, [])
      await setJson(`postmarked:mailbox:${normalizedEmail}`, [welcome, ...mailbox])
      await sendResendEmail({
        ...welcome,
        recipientEmail: normalizedEmail
      }).catch(() => null)

      const { passwordHash, ...safeAccount } = account
      return json(res, 200, { account: safeAccount, welcome })
    }

    if (req.method === 'POST' && action === 'login') {
      const normalizedEmail = normalizeEmail(req.body.email)
      const registry = await getJson('postmarked:registry', {})
      const account = registry[normalizedEmail]
      if (!account || !verifyPassword(req.body.password, account.passwordHash)) {
        return json(res, 401, { error: 'We could not match that postal email and password.' })
      }
      const mailbox = await getJson(`postmarked:mailbox:${normalizedEmail}`, [])
      await setJson(`postmarked:mailbox:${normalizedEmail}`, [])
      const { passwordHash, ...safeAccount } = account
      return json(res, 200, { account: safeAccount, mailbox })
    }

    if (req.method === 'POST' && action === 'send') {
      const letter = req.body.letter
      if (!letter?.recipientEmail) {
        return json(res, 400, { error: 'A recipient email is required.' })
      }

      const recipientEmail = normalizeEmail(letter.recipientEmail)
      const delivered = {
        ...letter,
        recipientEmail,
        id: `missive-inbox-${Date.now()}`,
        status: 'inbox',
        unread: true
      }
      const mailbox = await getJson(`postmarked:mailbox:${recipientEmail}`, [])
      await setJson(`postmarked:mailbox:${recipientEmail}`, [delivered, ...mailbox])
      await sendResendEmail(delivered)
      return json(res, 200, { delivered })
    }

    if (req.method === 'GET' && action === 'mailbox') {
      const normalizedEmail = normalizeEmail(req.query.email)
      if (!normalizedEmail) return json(res, 400, { error: 'Email is required.' })
      const mailbox = await getJson(`postmarked:mailbox:${normalizedEmail}`, [])
      await setJson(`postmarked:mailbox:${normalizedEmail}`, [])
      return json(res, 200, { mailbox })
    }

    return json(res, 404, { error: 'Unknown Postmarked API action.' })
  } catch (error) {
    return json(res, 500, { error: error.message || 'The Postmarked Bureau is unavailable.' })
  }
}
