import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
  const body = await req.json();
  const prompt = `Crie um sum\u00e1rio de monografia com base no seguinte contexto: ${JSON.stringify(body)}. Responda em JSON no formato {"chapters": [{"title": "", "subchapters": ["", ""]}]}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  });

  const text = completion.choices[0].message.content || '{}';
  return NextResponse.json(JSON.parse(text));
}
