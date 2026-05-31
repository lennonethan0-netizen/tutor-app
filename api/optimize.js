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
        system: `You are an expert CV coach. Review a CV and give specific, actionable recommendations showing exactly what to change and how to phrase it better.

Format your response as a list of recommendations. For each one:
- Quote the weak phrase from their CV (or note what is missing)
- Explain the problem in one sentence
- Give a specific improved version they can copy-paste

Use this format for each recommendation:
---
**[Section name]**
Original: "[quote from their CV, or 'Missing']"
Problem: [one sentence explaining why it's weak]
Improved: "[your better version they can use]"
---

Give 5–8 recommendations covering the most impactful improvements.
Focus on: weak verbs, missing numbers/metrics, vague descriptions, missing sections, poor summary.
Be specific — always give a rewritten version they can actually use.
Do not rewrite the whole CV. Just give targeted recommendations.`,
        messages: [{
          role: 'user',
          content: `Please review my CV and tell me exactly what to change:\n\n${cvText}`,
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
