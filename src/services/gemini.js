import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const MODEL_NAME = 'gemini-flash-latest'

class GeminiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'GeminiError'
    this.status = status
  }
}

let _client = null
function getClient() {
  if (!API_KEY) {
    throw new GeminiError('Missing VITE_GEMINI_API_KEY. Add it to your .env file.', 401)
  }
  if (!_client) _client = new GoogleGenerativeAI(API_KEY)
  return _client
}

async function generate(systemPrompt, userPrompt, { temperature = 0.5, json = false } = {}) {
  const client = getClient()
  const model = client.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      ...(json ? { responseMimeType: 'application/json' } : {}),
    },
  })

  let result
  try {
    result = await model.generateContent(userPrompt)
  } catch (e) {
    const msg = e?.message || String(e)
    if (msg.includes('API_KEY') || msg.includes('permission')) {
      throw new GeminiError('Invalid or unauthorized Gemini API key.', 401)
    }
    throw new GeminiError(`Gemini request failed: ${msg}`, 500)
  }

  const text = result?.response?.text?.()
  if (!text) throw new GeminiError('Empty response from Gemini.', 502)
  return text
}

function extractJson(raw) {
  if (!raw) throw new Error('No content returned.')
  let cleaned = String(raw).trim()
  cleaned = cleaned.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start !== -1 && end !== -1 && end > start) {
      try { return JSON.parse(cleaned.slice(start, end + 1)) } catch { /* fallthrough */ }
    }
    throw new Error('Gemini returned invalid JSON. Please retry.')
  }
}

function validateStudy(data) {
  if (!data || typeof data !== 'object') throw new Error('Invalid study payload.')
  const ensure = (val, fallback) => (Array.isArray(val) ? val : fallback)
  return {
    explanation: typeof data.explanation === 'string' ? data.explanation : '',
    notes: ensure(data.notes, []).filter((n) => typeof n === 'string'),
    flashcards: ensure(data.flashcards, [])
      .filter((c) => c && c.question && c.answer)
      .map((c) => ({ question: String(c.question), answer: String(c.answer) })),
    quiz: ensure(data.quiz, [])
      .filter((q) => q && q.question && Array.isArray(q.options) && q.correct)
      .map((q) => ({
        question: String(q.question),
        options: q.options.slice(0, 4).map(String),
        correct: String(q.correct),
        explanation: String(q.explanation || ''),
      })),
  }
}

export async function generateStudyMaterial(topic, difficulty) {
  const systemPrompt = `You are an expert university tutor. Generate a complete study material for the given topic and difficulty.
Return ONLY valid JSON (no markdown, no code fences). The JSON must match this exact shape:
{
  "explanation": "string (rich markdown with headings, lists, tables, and code blocks where helpful)",
  "notes": ["string x 10 concise bullet points"],
  "flashcards": [{"question": "string", "answer": "string"} x 10],
  "quiz": [{"question": "string", "options": ["string","string","string","string"], "correct": "string (must be one of the options)", "explanation": "string"} x 5]
}
Rules:
- explanation: 600-900 words, markdown formatted, well structured.
- notes: exactly 10 short bullet strings.
- flashcards: exactly 10 items.
- quiz: exactly 5 items, each with exactly 4 options.
- correct must be one of the options verbatim.
- Output ONLY the JSON object. No prose, no \`\`\`json fences.`

  const userPrompt = `Topic: ${topic}\nDifficulty: ${difficulty}\nGenerate the complete study material as JSON.`
  const raw = await generate(systemPrompt, userPrompt, { temperature: 0.5, json: true })
  return validateStudy(extractJson(raw))
}

export async function translateContent(text, target) {
  const targets = {
    'roman-urdu': 'Roman Urdu (Latin script, conversational Pakistani Urdu written in English letters)',
    'urdu-script': 'Urdu script (Nastaliq/Nastaleeq, proper Urdu characters)',
  }
  const targetDesc = targets[target]
  if (!targetDesc) throw new Error('Unknown translation target.')
  const systemPrompt = `You are a precise translator. Translate the user's text into the requested target language/variant. Return ONLY the translated text. Preserve markdown formatting, code blocks, lists, and tables exactly. Do not add notes or preamble.`
  const userPrompt = `Translate the following text into ${targetDesc}. Return ONLY the translation.\n\nTEXT:\n${text}`
  return await generate(systemPrompt, userPrompt, { temperature: 0.2 })
}
