import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

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

  try {
    const response = await fetch(url, fetchOptions)
    const data = await response.json()

    const res = NextResponse.json(data, { status: response.status })

    // Set token cookie on successful signin/signup
    if (response.ok && (path === 'signin' || path === 'signup') && data.token) {
      res.cookies.set('token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
    }

    return res
  } catch {
    return NextResponse.json(
      { message: 'Erreur de connexion au serveur' },
      { status: 502 }
    )
  }
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
