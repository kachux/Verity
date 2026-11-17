import { NextResponse } from 'next/server';
import { DB } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const audit = DB.getAuditById(params.id);
  if (!audit) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
  }
  return NextResponse.json({ audit });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = DB.updateAudit(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, audit: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const deleted = DB.deleteAudit(params.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
