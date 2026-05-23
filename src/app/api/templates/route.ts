// src/app/api/templates/route.ts

import { NextResponse } from 'next/server';
import { getAllTemplates, getTemplatesByCategory } from '@/overlay-engine/registry';

// GET /api/templates?category=ticker
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const templates = category ? getTemplatesByCategory(category) : getAllTemplates();

    return NextResponse.json({ templates });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
