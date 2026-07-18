// Standalone test for the Gemini SDK integration.
// Run with: npm run test:gemini
import { GoogleGenerativeAI } from '@google/generative-ai'
import 'dotenv/config'

const API_KEY = process.env.VITE_GEMINI_API_KEY
const MODEL_NAME = 'gemini-flash-latest'

if (!API_KEY) {
  console.error('FAIL: VITE_GEMINI_API_KEY is not set in .env')
  process.exit(1)
}

const client = new GoogleGenerativeAI(API_KEY)
const model = client.getGenerativeModel({
  model: MODEL_NAME,
  generationConfig: {
    temperature: 0.5,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 256,
    responseMimeType: 'application/json',
  },
})

const prompt = 'Return a JSON object with a single key "greeting" set to "hello". Output ONLY the JSON.'

try {
  const result = await model.generateContent(prompt)
  const text = result.response.text()
  console.log('Raw response:', text)
  let parsed
  try { parsed = JSON.parse(text) } catch { throw new Error('Response was not valid JSON') }
  if (!parsed.greeting) throw new Error('Missing "greeting" field')
  console.log('PASS: Gemini API call succeeded with model', MODEL_NAME)
  console.log('Parsed:', parsed)
  process.exit(0)
} catch (e) {
  console.error('FAIL:', e.message || e)
  process.exit(1)
}
