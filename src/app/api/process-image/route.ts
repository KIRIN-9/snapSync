import { NextRequest, NextResponse } from 'next/server';
import { processImageWithGemini } from '@/app/utils/gemini';
import { setLatestAutoUploadResult } from '@/app/utils/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const filename = formData.get('filename') as string || 'hello.png';

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const result = await processImageWithGemini(imageBuffer);

    // Store the result for auto-upload-latest endpoint
    setLatestAutoUploadResult(result, filename);

    return NextResponse.json({
      result,
      timestamp: new Date().toISOString(),
      filename,
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
