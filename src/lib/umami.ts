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

export async function getStats(range: string, websiteId?: string) {
  const targetWebsiteId = websiteId || UMAMI_WEBSITE_ID;
  
  if (!UMAMI_API_CLIENT_ENDPOINT || !targetWebsiteId) {
    throw new Error('Missing required Umami API environment variables');
  }

  const params = getRangeParams(range);
  const url = `${UMAMI_API_CLIENT_ENDPOINT}websites/${targetWebsiteId}/stats?startAt=${params.startAt}&endAt=${params.endAt}`;
  
  const data = await httpGet<any>(url);
  
  return {
    pageviews: data.pageviews?.value ?? data.pageviews ?? 0,
    uniques: data.visitors?.value ?? data.visitors ?? 0,
    bounceRate: data.bounces ? Math.round((data.bounces / data.visits) * 100) : 0,
    avgSession: data.totaltime && data.visits ? Math.round(data.totaltime / data.visits) : 0,
  };
}

export async function getPageviews(range: string, websiteId?: string) {
  const targetWebsiteId = websiteId || UMAMI_WEBSITE_ID;
  
  if (!UMAMI_API_CLIENT_ENDPOINT || !targetWebsiteId) {
    throw new Error('Missing required Umami API environment variables');
  }

  const params = getRangeParams(range);
  const unit = range === '1d' ? 'hour' : 'day';
  const url = `${UMAMI_API_CLIENT_ENDPOINT}websites/${targetWebsiteId}/pageviews?startAt=${params.startAt}&endAt=${params.endAt}&unit=${unit}&timezone=UTC`;
  
  const data = await httpGet<any>(url);
  
  const pageviews = data.pageviews || [];
  return pageviews.map((item: any) => ({
    date: item.x,
    pageviews: item.y ?? 0,
    uniques: item.z ?? 0,
  }));
}

export async function getWebsites() {
  if (!UMAMI_API_CLIENT_ENDPOINT) {
    throw new Error('Missing required Umami API environment variables');
  }

  const url = `${UMAMI_API_CLIENT_ENDPOINT}websites`;
  const data = await httpGet<any>(url);
  
  const websites = Array.isArray(data) ? data : data.data || data.websites || [];
  
  return websites.map((item: any) => ({
    id: item.id,
    name: item.name,
    domain: item.domain,
    enabled: item.enabled,
  }));
}

export async function getMetrics(range: string, type: string, websiteId?: string): Promise<{ name: string; value: number }[]> {
  const targetWebsiteId = websiteId || UMAMI_WEBSITE_ID;
  
  if (!UMAMI_API_CLIENT_ENDPOINT || !targetWebsiteId) {
    throw new Error('Missing required Umami API environment variables');
  }

  const params = getRangeParams(range);
  const url = `${UMAMI_API_CLIENT_ENDPOINT}websites/${targetWebsiteId}/metrics?startAt=${params.startAt}&endAt=${params.endAt}&type=${type}`;
  
  const data = await httpGet<any[]>(url);

  const aggregated = data.reduce((acc: Record<string, number>, item: any) => {
    const name = type === 'query' ? formatQueryName(item.x) : item.x;
    acc[name] = (acc[name] || 0) + item.y;
    return acc;
  }, {});

  return Object.entries(aggregated).map(([name, value]) => ({
    name,
    value: value as number,
  }));
}


function formatQueryName(name: string): string {
  // Extract path from "body=include/path&..."
  const match = name.match(/body=include\/([^&]+)/);
  if (match) {
    return `/${match[1]}`;
  }
  return name;
}

