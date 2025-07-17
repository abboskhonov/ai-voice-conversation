import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  try {
    const didRes = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.DID_API_KEY!).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_url: process.env.AVATAR_IMAGE_URL, // your static avatar
        script: { type: 'text', input: text },
        config: { fluent: true },
      }),
    });
    const payload = await didRes.json();
    res.status(200).json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to call D‑ID API' });
  }
}
