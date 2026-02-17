import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { battleState } = await req.json()

  const apiKey = process.env.OPENROUTER_API_KEY
  const model = process.env.MODEL_OPENROUTER

  if (!apiKey) {
    return NextResponse.json(
      { message: 'OPENROUTER_API_KEY is not configured' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: `Tu es un champion d'arene Pokemon. Analyse l'etat du combat et choisis la meilleure action.
Reponds UNIQUEMENT en JSON : { "action": "attack", "attack_id": number } ou { "action": "switch", "pokemon_id": number }.
Sois strategique : exploite les faiblesses de type, gere tes HP, switch si desavantage.`
          },
          {
            role: 'user',
            content: JSON.stringify(battleState)
          }
        ],
        response_format: { type: 'json_object' }
      })
    })

    const data = await response.json()
    const action = JSON.parse(data.choices[0].message.content)

    return NextResponse.json(action)
  } catch {
    // Fallback: pick first available attack
    const fallbackAction = battleState?.champion_active_pokemon?.attacks?.[0]
    return NextResponse.json({
      action: 'attack',
      attack_id: fallbackAction?.id || 1
    })
  }
}
