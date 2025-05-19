'use client'
import { useState } from 'react'

export default function Home() {
  const [bookId, setBookId] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState('')
  const [text, setText] = useState('') // ✅ Store the full book text

  const handleAnalyze = async () => {
    setLoading(true)

    try {
      const contentUrl = `https://thingproxy.freeboard.io/fetch/https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.txt`
      const res = await fetch(contentUrl)

      if (!res.ok) {
        throw new Error("Could not fetch book.")
      }

      const bookText = await res.text()
      console.log("Book Text Preview:", bookText.slice(0, 500))

      setText(bookText) // ✅ Save text for preview
      await sendToLLM(bookText)

      alert("Book downloaded and analyzed! Check below.")
    } catch (err) {
      console.error(err)
      alert("Failed to fetch book.")
    }

    setLoading(false)
  }

  const sendToLLM = async (bookText) => {
    const result = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: bookText })
    })

    const json = await result.json()

    if (!json.choices || !json.choices[0]) {
      console.error('LLM did not return choices:', json)
      alert("AI analysis failed. Check the console.")
      return
    }

    const content = json.choices[0].message.content
    console.log("🧠 LLM Response:", content)
    setAnalysisResult(content)
  }

  return (
    <main className="min-h-screen p-8 bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">📚 Project Gutenberg Analyzer</h1>

      <input
        type="text"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
        placeholder="Enter Project Gutenberg Book ID (e.g. 1787)"
        className="p-3 w-full max-w-md text-white bg-gray-800 rounded mb-4 placeholder-gray-400"
      />

      <button
        onClick={handleAnalyze}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {loading && (
        <p className="text-gray-400 mt-4">
          Analyzing book, please wait...
        </p>
      )}

      {text && (
        <div className="mt-6 p-4 bg-gray-800 rounded">
          <h2 className="text-lg font-semibold mb-2 text-gray-300">📖 Book Preview:</h2>
          <p className="text-sm text-gray-400">{text.slice(0, 300)}...</p>
        </div>
      )}

      {analysisResult && (
        <div className="mt-6 p-4 bg-gray-900 rounded">
          <h2 className="text-xl font-bold mb-2">🧠 AI Analysis Result:</h2>
          <pre className="whitespace-pre-wrap">{analysisResult}</pre>
        </div>
      )}
    </main>
  )
}
