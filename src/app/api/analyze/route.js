export async function POST(req) {
  const { text } = await req.json();

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer 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',  // 👈 Replace with your new Groq key
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192'
,
      messages: [
        {
          role: 'user',
         content: `Extract and list all character names and how they interact. If none are found, explain why:\n\n${text.slice(0, 3000)}`


        }
      ]
    }),
  });

  const data = await response.json();
  console.log("🧠 Groq raw response:", data)

  if (!data.choices || !data.choices[0]) {
    return new Response(JSON.stringify({ error: 'No valid response from Groq', raw: data }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

