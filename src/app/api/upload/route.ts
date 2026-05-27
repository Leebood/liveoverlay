// src/app/api/upload/route.ts

import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const storeId = formData.get('storeId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!storeId) {
      return NextResponse.json({ error: 'Missing storeId' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PNG, JPEG, SVG, and WebP are allowed.' }, { status: 400 });
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 2MB.' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    // Generate unique file path
    const ext = file.name.split('.').pop() || 'png';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filePath = `logos/${storeId}/${timestamp}-${randomStr}.${ext}`;

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, uint8Array, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      // If storage bucket doesn't exist, store as base64 in database
      console.warn('Storage upload failed, storing URL reference:', uploadError.message);
    }

    let url = '';
    if (uploadData) {
      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filePath);
      url = urlData.publicUrl;
    } else {
      // Fallback: store as data URL (for environments without storage bucket)
      const base64 = `data:${file.type};base64,${Buffer.from(uint8Array).toString('base64')}`;
      url = base64;
    }

    // Update store with logo URL
    await supabase
      .from('stores')
      .update({ brand_logo: url })
      .eq('id', storeId);

    return NextResponse.json({ url, path: filePath });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
