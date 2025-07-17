// pages/api/tts.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'nova',
        input: text,
      }),
    });

    if (!response.ok || !response.body) {
      return res.status(500).json({ error: 'TTS generation failed' });
    }

    // Convert Web ReadableStream to Node.js Readable
    const webStream = response.body as ReadableStream<Uint8Array>;
    const nodeStream = Readable.fromWeb(webStream);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'inline; filename="speech.mp3"');

    nodeStream.pipe(res);
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
