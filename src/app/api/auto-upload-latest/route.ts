import { NextResponse } from 'next/server';
import { getLatestAutoUploadResult } from '@/app/utils/storage';

export async function GET() {
  try {
    const latestResult = getLatestAutoUploadResult();

    if (!latestResult) {
      // Return 200 with a message instead of 404 to avoid error state in RTK Query
      return NextResponse.json(
        { message: 'No auto-uploaded images yet' },
        { status: 200 }
      );
    }

    return NextResponse.json(latestResult);
  } catch (error) {
    console.error('Error retrieving latest auto-uploaded result:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve latest auto-uploaded result' },
      { status: 500 }
    );
  }
}
