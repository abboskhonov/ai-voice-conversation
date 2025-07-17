// pages/api/tts.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';

// Node 18+ has Readable.fromWeb; ensure compatibility
function toNodeReadable(webStream: ReadableStream): Readable {
  if ('fromWeb' in Readable && typeof Readable.fromWeb === 'function') {
    return Readable.fromWeb(webStream as any);
  }

  throw new Error('Readable.fromWeb is not available in this Node.js version');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required and must be a string' });
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
      console.error('TTS API failed:', await response.text());
      return res.status(500).json({ error: 'TTS generation failed' });
    }

    const nodeStream = toNodeReadable(response.body as ReadableStream);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'inline; filename="speech.mp3"');

    nodeStream.pipe(res);
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
