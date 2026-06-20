import { NextResponse } from 'next/server';
import { getBouquet } from '@/lib/store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const bouquet = getBouquet(id);

  if (!bouquet) {
    return NextResponse.json(
      { error: 'Bouquet not found' },
      { status: 404 },
    );
  }

  return NextResponse.json(bouquet);
}
