import { NextResponse } from 'next/server';
import { validateLead } from '@/lib/lead-validation';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateLead(body);

    if (!validation.ok) {
      return NextResponse.json({ ok: false, errors: validation.errors }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('leads')
      .insert(validation.data)
      .select('id,name,email,company,message,source,status,created_at')
      .single();

    if (error) {
      console.error('Lead insert failed:', error);
      return NextResponse.json({ ok: false, error: 'Unable to save lead.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, lead: data }, { status: 201 });
  } catch (error) {
    console.error('Lead API request failed:', error);
    return NextResponse.json({ ok: false, error: 'Invalid JSON or server error.' }, { status: 400 });
  }
}
