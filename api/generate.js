export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { experience } = req.body
  if (!experience) return res.status(400).json({ error: 'Missing experience text' })

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
        system: `You are an expert CV writer. Transform raw experience notes into a polished, professional CV.

Rules:
- NEVER invent or fabricate skills or experience not mentioned by the user
- Structure: Professional Summary → Key Skills → Work Experience → Education → (Additional sections if relevant)
- Use ## for section headings
- Use strong action verbs: led, built, developed, managed, designed, delivered, achieved, increased, reduced
- Add bullet points for each role's responsibilities and achievements
- Make it ATS-friendly with clear formatting
- Infer professional language from what is given, but stay truthful to the facts provided
- Return ONLY the CV content, no commentary or preamble`,
        messages: [{
          role: 'user',
          content: `Here is my experience, background, and skills. Please turn this into a proper professional CV:\n\n${experience}`,
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
