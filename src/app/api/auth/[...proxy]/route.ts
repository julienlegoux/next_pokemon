import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function proxyRequest(req: NextRequest, params: Promise<{ proxy: string[] }>) {
  const { proxy } = await params
  const path = proxy.join('/')
  const url = `${API_URL}/${path}`

  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get('token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Get token from cookie or Authorization header
  const authHeader = req.headers.get('Authorization')
  if (authHeader) {
    headers['Authorization'] = authHeader
  } else if (tokenCookie) {
    headers['Authorization'] = `Bearer ${tokenCookie.value}`
  }

  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const body = await req.text()
    if (body) {
      fetchOptions.body = body
    }
  }

  let response: Response
  try {
    response = await fetch(url, fetchOptions)
  } catch (err) {
    console.error(`[auth proxy] fetch failed for ${url}:`, err)
    return NextResponse.json(
      { message: 'Erreur de connexion au serveur' },
      { status: 502 }
    )
  }

  const text = await response.text()
  let data: Record<string, unknown>
  try {
    data = JSON.parse(text)
  } catch {
    console.error(`[auth proxy] non-JSON response from ${url} (${response.status}):`, text.slice(0, 500))
    return NextResponse.json(
      { message: `Le serveur a répondu avec une erreur (${response.status})` },
      { status: response.status || 502 }
    )
  }

  const res = NextResponse.json(data, { status: response.status })

  // Set token cookie on successful signin/signup
  if (response.ok && (path === 'signin' || path === 'signup') && typeof data.token === 'string') {
    res.cookies.set('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
  }

  return res
}

export async function GET(req: NextRequest, context: { params: Promise<{ proxy: string[] }> }) {
  return proxyRequest(req, context.params)
}

export async function POST(req: NextRequest, context: { params: Promise<{ proxy: string[] }> }) {
  return proxyRequest(req, context.params)
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ proxy: string[] }> }) {
  return proxyRequest(req, context.params)
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ proxy: string[] }> }) {
  return proxyRequest(req, context.params)
}
