const UMAMI_USERNAME = process.env.UMAMI_USERNAME || 'admin';
const UMAMI_PASSWORD = process.env.UMAMI_PASSWORD || 'umami';
const UMAMI_API_CLIENT_ENDPOINT = process.env.UMAMI_API_CLIENT_ENDPOINT;
const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;

let cachedToken: { token: string; exp: number } | null = null;

async function login(): Promise<string> {
  const response = await fetch(`${UMAMI_API_CLIENT_ENDPOINT}auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: UMAMI_USERNAME,
      password: UMAMI_PASSWORD,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Login failed! status: ${response.status} - ${text}`);
  }

  const data = await response.json();
  return data.token;
}

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.exp - 60000) {
    return cachedToken.token;
  }

  const token = await login();
  cachedToken = { token, exp: Date.now() + 86400000 };
  return token;
}

async function httpGet<T>(url: string): Promise<T> {
  const token = await getToken();
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP error! status: ${response.status} - ${text}`);
  }
  
  return response.json();
}

function getRangeParams(range: string) {
  const now = new Date();
  let startAt = new Date();
  
  if (range === '1d') startAt.setHours(0, 0, 0, 0);
  else if (range === '7d') startAt.setDate(now.getDate() - 7);
  else if (range === '30d') startAt.setDate(now.getDate() - 30);
  
  return {
    startAt: startAt.getTime(),
    endAt: now.getTime(),
  };
}

export async function getStats(range: string) {
  if (!UMAMI_API_CLIENT_ENDPOINT || !UMAMI_WEBSITE_ID) {
    throw new Error('Missing required Umami API environment variables');
  }

  const params = getRangeParams(range);
  const url = `${UMAMI_API_CLIENT_ENDPOINT}websites/${UMAMI_WEBSITE_ID}/stats?startAt=${params.startAt}&endAt=${params.endAt}`;
  
  const data = await httpGet<any>(url);
  
  return {
    pageviews: data.pageviews?.value ?? data.pageviews ?? 0,
    uniques: data.visitors?.value ?? data.visitors ?? 0,
    bounceRate: data.bounces ? Math.round((data.bounces / data.visits) * 100) : 0,
    avgSession: data.totaltime && data.visits ? Math.round(data.totaltime / data.visits) : 0,
  };
}

export async function getPageviews(range: string) {
  if (!UMAMI_API_CLIENT_ENDPOINT || !UMAMI_WEBSITE_ID) {
    throw new Error('Missing required Umami API environment variables');
  }

  const params = getRangeParams(range);
  const url = `${UMAMI_API_CLIENT_ENDPOINT}websites/${UMAMI_WEBSITE_ID}/pageviews?startAt=${params.startAt}&endAt=${params.endAt}&unit=day&timezone=UTC`;
  
  const data = await httpGet<any>(url);
  
  const pageviews = data.pageviews || [];
  return pageviews.map((item: any) => ({
    date: item.x,
    pageviews: item.y,
    uniques: item.z,
  }));
}

export async function getMetrics(range: string, type: string) {
  if (!UMAMI_API_CLIENT_ENDPOINT || !UMAMI_WEBSITE_ID) {
    throw new Error('Missing required Umami API environment variables');
  }

  const params = getRangeParams(range);
  const url = `${UMAMI_API_CLIENT_ENDPOINT}websites/${UMAMI_WEBSITE_ID}/metrics?startAt=${params.startAt}&endAt=${params.endAt}&type=${type}`;
  
  const data = await httpGet<any[]>(url);
  
  return data.map((item: any) => ({
    name: item.x,
    value: item.y,
  }));
}
