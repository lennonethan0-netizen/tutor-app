export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { jobDesc, cvText } = req.body
  if (!jobDesc || !cvText) return res.status(400).json({ error: 'Missing fields' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Service not configured' })

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        system: `You are an expert cover letter writer. Write compelling, personalised cover letters.

Rules:
- 3-4 short paragraphs
- Opening: genuine interest, mention the specific role
- Middle: 2-3 achievements from the CV that match the role
- Closing: confident call to action
- Tone: professional but human
- DO NOT use clichés like "I am writing to apply" or "I believe I would be a great fit"
- Return ONLY the cover letter text, no commentary`,
        messages: [{
          role: 'user',
          content: `JOB DESCRIPTION:\n${jobDesc}\n\nCV:\n${cvText}\n\nWrite a tailored cover letter.`
        }],
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return res.status(response.status).json({ error: err?.error?.message || 'AI error' })
    }

    const data = await response.json()
    res.json({ result: data.content[0].text })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
