// One-time API route to enable WAL mode on the SQLite database
// After running this once, you can delete this file.
// Usage: GET /api/db-wal?secret=wal-setup-2026

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

async function enableWal() {
  try {
    // Run the WAL pragma (query, not execute — it returns the new mode)
    const rows = await prisma.$queryRawUnsafe('PRAGMA journal_mode=WAL')
    const mode = Array.isArray(rows) ? rows[0]?.journal_mode : (rows?.journal_mode ?? 'unknown')
    return { success: true, journal_mode: mode }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== 'wal-setup-2026') {
    return NextResponse.json({ error: 'Unauthorized - wrong secret' }, { status: 401 })
  }

  const result = await enableWal()
  return NextResponse.json(result)
}

export async function POST(request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== 'wal-setup-2026') {
    return NextResponse.json({ error: 'Unauthorized - wrong secret' }, { status: 401 })
  }

  const result = await enableWal()
  return NextResponse.json(result)
}
