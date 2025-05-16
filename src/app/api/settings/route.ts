import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSettings, AnswerMode } from '@/app/utils/settings';

// GET endpoint to retrieve current settings
export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error retrieving settings:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve settings' },
      { status: 500 }
    );
  }
}

// POST endpoint to update settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate answerMode if provided
    if (body.answerMode !== undefined) {
      if (![AnswerMode.DETAILED, AnswerMode.LETTER_ONLY].includes(body.answerMode)) {
        return NextResponse.json(
          { error: 'Invalid answer mode' },
          { status: 400 }
        );
      }
    }
    
    // Update settings
    const updatedSettings = updateSettings(body);
    
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
