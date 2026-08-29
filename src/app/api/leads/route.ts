import { NextResponse } from 'next/server';
import { validateLead } from '@/lib/lead-validation';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { qualifyLead } from '@/lib/ai-qualification';

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const validation = validateLead(body);

    if (!validation.ok) {
      return NextResponse.json({ ok: false, errors: validation.errors }, { status: 400 });
    }

    const lead = validation.data;
    const qualification = qualifyLead(lead);
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from('leads')
      .insert({
        ...lead,
        ai_score: qualification.score,
        ai_temperature: qualification.temperature,
        ai_category: qualification.category,
        ai_summary: qualification.summary,
        ai_recommended_action: qualification.recommendedAction,
        ai_suggested_reply: qualification.suggestedReply,
        status: qualification.temperature === 'Spam' ? 'closed' : 'qualified',
      })
      .select('id,name,email,company,message,source,status,ai_score,ai_temperature,ai_category,ai_summary,ai_recommended_action,ai_suggested_reply,created_at,updated_at')
      .single();

    if (error) {
      console.error('Lead insert failed:', error.message);
      return NextResponse.json({ ok: false, error: 'Unable to save lead.' }, { status: 502 });
    }

    return NextResponse.json({ ok: true, lead: data }, { status: 201 });
  } catch (error) {
    console.error('Lead API request failed:', error);
    return NextResponse.json({ ok: false, error: 'Invalid JSON or server configuration.' }, { status: 400 });
  }
}
