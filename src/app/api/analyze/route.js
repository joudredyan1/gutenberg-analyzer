export async function POST(req) {
  const { text } = await req.json();

  // ✅ Use environment variable
  const apiKey = process.env.GROQ_API_KEY;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`, // ✅ Correct usage
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'user',
          content: `Extract and list all character names and how they interact. If none are found, explain why:\n\n${text.slice(0, 3000)}`
        }
      ]
    }),
  });

  const data = await response.json();
  console.log("🔎 Full Groq response:", data); // ✅ Add log to debug

  if (!data.choices || !data.choices[0]) {
    return new Response(JSON.stringify({ error: 'No valid response from Groq', raw: data }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
