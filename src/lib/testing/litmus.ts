// Litmus API Integration for Visual Email Testing
// https://litmus.com/docs/api/

export interface LitmusConfig {
  apiKey: string;
  apiSecret?: string;
  baseUrl?: string;
}

export interface LitmusTestResult {
  testId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resultsUrl?: string;
  screenshots?: LitmusScreenshot[];
}

export interface LitmusScreenshot {
  client: string;
  platform: string;
  imageUrl: string;
  fullImageUrl?: string;
}

// Default Litmus API base URL
const DEFAULT_BASE_URL = 'https://instant-api.litmus.com/v1';

// Email clients to test (subset of available clients)
const DEFAULT_CLIENTS = [
  'ol2019', // Outlook 2019
  'ol2016', // Outlook 2016
  'gmail', // Gmail Web
  'gmailapp_android', // Gmail App Android
  'iphone14', // iPhone 14
  'appmail16', // Apple Mail 16
];

/**
 * Creates a Litmus test from HTML email content
 */
export async function sendToLitmus(
  html: string,
  subject: string,
  config: LitmusConfig
): Promise<LitmusTestResult> {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URL;

  // Create the test via Litmus Instant API
  const response = await fetch(`${baseUrl}/emails`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${config.apiKey}:${config.apiSecret || ''}`)}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject,
      html_text: html,
      clients: DEFAULT_CLIENTS,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Litmus API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  return {
    testId: data.id || data.email_guid,
    status: 'processing',
    resultsUrl: data.url_or_guid ? `https://litmus.com/tests/${data.url_or_guid}` : undefined,
  };
}

/**
 * Gets the status and results of a Litmus test
 */
export async function getTestResults(
  testId: string,
  config: LitmusConfig
): Promise<LitmusTestResult> {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URL;

  const response = await fetch(`${baseUrl}/emails/${testId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${btoa(`${config.apiKey}:${config.apiSecret || ''}`)}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Litmus API error: ${response.status}`);
  }

  const data = await response.json();

  // Parse screenshots from response
  const screenshots: LitmusScreenshot[] = [];
  if (data.results) {
    for (const result of data.results) {
      screenshots.push({
        client: result.client_name || result.application,
        platform: result.platform || 'unknown',
        imageUrl: result.image_url || result.thumbnail,
        fullImageUrl: result.full_image_url || result.full_image,
      });
    }
  }

  return {
    testId,
    status: data.status === 'complete' ? 'completed' : data.status,
    resultsUrl: `https://litmus.com/tests/${testId}`,
    screenshots,
  };
}

/**
 * Sends email to Litmus and polls for results
 */
export async function testEmailWithLitmus(
  html: string,
  subject: string,
  config: LitmusConfig,
  pollInterval = 5000,
  maxAttempts = 24 // 2 minutes max
): Promise<LitmusTestResult> {
  // Send to Litmus
  const initial = await sendToLitmus(html, subject, config);

  // Poll for completion
  let attempts = 0;
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, pollInterval));

    const result = await getTestResults(initial.testId, config);

    if (result.status === 'completed') {
      return result;
    }

    if (result.status === 'failed') {
      throw new Error('Litmus test failed');
    }

    attempts++;
  }

  // Return current status even if not complete
  return getTestResults(initial.testId, config);
}

/**
 * Validates Litmus configuration
 */
export function validateLitmusConfig(config: Partial<LitmusConfig>): { valid: boolean; error?: string } {
  if (!config.apiKey) {
    return { valid: false, error: 'LITMUS_API_KEY is required' };
  }

  return { valid: true };
}

/**
 * Gets Litmus config from environment variables
 */
export function getLitmusConfigFromEnv(): LitmusConfig | null {
  const apiKey = process.env.LITMUS_API_KEY;

  if (!apiKey) {
    return null;
  }

  return {
    apiKey,
    apiSecret: process.env.LITMUS_API_SECRET,
    baseUrl: process.env.LITMUS_BASE_URL,
  };
}
