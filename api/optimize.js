export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { cvText } = req.body
  if (!cvText) return res.status(400).json({ error: 'Missing CV text' })

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
        max_tokens: 3000,
        system: `You are an expert CV writer. Improve this CV to be professional, impactful, and well-structured.

Rules:
- NEVER invent skills or experience the candidate doesn't have
- Rewrite EXISTING experience using strong action verbs: led, delivered, built, designed, achieved, increased, reduced
- Add quantified achievements where they can be reasonably inferred from context
- Structure: Professional Summary → Key Skills → Work Experience → Education
- Use ## for section headings
- Use industry-standard professional language throughout
- Return ONLY the CV content, no commentary`,
        messages: [{
          role: 'user',
          content: `Please improve this CV:\n\n${cvText}`,
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
