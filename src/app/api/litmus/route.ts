import { NextRequest, NextResponse } from 'next/server';
import {
  sendToLitmus,
  getTestResults,
  validateLitmusConfig,
  getLitmusConfigFromEnv,
} from '@/lib/testing/litmus';

interface SendTestRequest {
  html: string;
  subject: string;
}

interface GetResultsRequest {
  testId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendTestRequest = await request.json();
    const { html, subject } = body;

    if (!html || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: html, subject' },
        { status: 400 }
      );
    }

    const config = getLitmusConfigFromEnv();

    if (!config) {
      return NextResponse.json(
        { error: 'Litmus API key not configured. Set LITMUS_API_KEY in environment.' },
        { status: 500 }
      );
    }

    const validation = validateLitmusConfig(config);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 500 }
      );
    }

    const result = await sendToLitmus(html, subject, config);

    return NextResponse.json({
      success: true,
      testId: result.testId,
      status: result.status,
      resultsUrl: result.resultsUrl,
    });

  } catch (error) {
    console.error('Litmus API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');

    if (!testId) {
      return NextResponse.json(
        { error: 'Missing testId parameter' },
        { status: 400 }
      );
    }

    const config = getLitmusConfigFromEnv();

    if (!config) {
      return NextResponse.json(
        { error: 'Litmus API key not configured' },
        { status: 500 }
      );
    }

    const result = await getTestResults(testId, config);

    return NextResponse.json({
      testId: result.testId,
      status: result.status,
      resultsUrl: result.resultsUrl,
      screenshots: result.screenshots,
    });

  } catch (error) {
    console.error('Litmus API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
