import { NextResponse } from 'next/server';
import { saveBouquet } from '@/lib/store';
import type { Bouquet } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const short_id = crypto.randomUUID();
    const bouquet: Bouquet = {
      short_id,
      mode: body.mode ?? 'color',
      flowers: body.flowers ?? [],
      greenery: body.greenery ?? 'bush-1',
      flowerOrder: body.flowerOrder ?? [],
      letter: body.letter ?? { dear: '', message: '', sincerely: '' },
      timestamp: Date.now(),
    };

    saveBouquet(bouquet);

    return NextResponse.json({ short_id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create bouquet' },
      { status: 400 },
    );
  }
}
