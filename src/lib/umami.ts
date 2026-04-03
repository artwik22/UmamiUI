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
  else if (range === 'all') startAt = new Date(2020, 0, 1);
  
  return {
    startAt: startAt.getTime(),
    endAt: now.getTime(),
  };
}

function getPreviousRangeParams(range: string) {
  const now = new Date();
  let prevStartAt = new Date();
  let prevEndAt = new Date();
  
  if (range === '1d') {
    prevEndAt.setHours(now.getHours() - 24);
    prevStartAt.setHours(0, 0, 0, 0);
  } else if (range === '7d') {
    prevStartAt.setDate(now.getDate() - 14);
    prevEndAt.setDate(now.getDate() - 7);
  } else if (range === '30d') {
    prevStartAt.setDate(now.getDate() - 60);
    prevEndAt.setDate(now.getDate() - 30);
  } else if (range === 'all') {
    return null;
  }
  
  return {
    startAt: prevStartAt.getTime(),
    endAt: prevEndAt.getTime(),
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
  
  const prevParams = getPreviousRangeParams(range);
  let prevData = null;
  
  if (prevParams) {
    const prevUrl = `${UMAMI_API_CLIENT_ENDPOINT}websites/${targetWebsiteId}/stats?startAt=${prevParams.startAt}&endAt=${prevParams.endAt}`;
    try {
      prevData = await httpGet<any>(prevUrl);
    } catch (e) {
      console.warn('Failed to fetch previous period stats');
    }
  }

  const calcTrend = (current: number, previous: number) => {
    if (!previous || previous === 0) return null;
    return Math.round(((current - previous) / previous) * 100);
  };

  const currentPageviews = data.pageviews?.value ?? data.pageviews ?? 0;
  const currentUniques = data.visitors?.value ?? data.visitors ?? 0;
  const currentBounces = data.bounces ?? 0;
  const currentVisits = data.visits ?? 0;
  const currentTotalTime = data.totaltime ?? 0;

  return {
    pageviews: currentPageviews,
    uniques: currentUniques,
    bounceRate: currentVisits > 0 ? Math.round((currentBounces / currentVisits) * 100) : 0,
    avgSession: currentVisits > 0 ? Math.round(currentTotalTime / currentVisits) : 0,
    trends: {
      pageviews: prevData ? calcTrend(currentPageviews, prevData.pageviews?.value ?? prevData.pageviews ?? 0) : null,
      uniques: prevData ? calcTrend(currentUniques, prevData.visitors?.value ?? prevData.visitors ?? 0) : null,
      bounceRate: prevData && prevData.visits ? calcTrend(
        currentVisits > 0 ? Math.round((currentBounces / currentVisits) * 100) : 0,
        Math.round((prevData.bounces ?? 0) / (prevData.visits ?? 1) * 100)
      ) : null,
      avgSession: prevData && prevData.visits ? calcTrend(
        currentVisits > 0 ? Math.round(currentTotalTime / currentVisits) : 0,
        Math.round((prevData.totaltime ?? 0) / (prevData.visits ?? 1))
      ) : null,
    },
  };
}

export async function getPageviews(range: string, websiteId?: string) {
  const targetWebsiteId = websiteId || UMAMI_WEBSITE_ID;
  
  if (!UMAMI_API_CLIENT_ENDPOINT || !targetWebsiteId) {
    throw new Error('Missing required Umami API environment variables');
  }

  const params = getRangeParams(range);
  const unit = range === '1d' ? 'hour' : (range === 'all' ? 'year' : 'day');
  const unitParam = `&unit=${unit}`;
  const url = `${UMAMI_API_CLIENT_ENDPOINT}websites/${targetWebsiteId}/pageviews?startAt=${params.startAt}&endAt=${params.endAt}${unitParam}&timezone=UTC`;
  
  const data = await httpGet<any>(url);

  console.log('API Response for range', range, ':', JSON.stringify(data, null, 2));

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

export async function getAllWebsitesStats(range: string) {
  const websites = await getWebsites();
  
  const results = await Promise.all(
    websites.map(async (site) => {
      try {
        const stats = await getStats(range, site.id);
        return { ...site, stats };
      } catch (error) {
        console.error(`Failed to get stats for ${site.name}:`, error);
        return { ...site, stats: null };
      }
    })
  );

  const validResults = results.filter(r => r.stats !== null);
  
  const aggregated = validResults.reduce(
    (acc, site) => ({
      pageviews: acc.pageviews + (site.stats?.pageviews || 0),
      uniques: acc.uniques + (site.stats?.uniques || 0),
      bounces: (acc.bounces || 0) + (site.stats?.bounceRate ? Math.round((site.stats?.pageviews || 0) * site.stats.bounceRate / 100) : 0),
      totalTime: (acc.totalTime || 0) + ((site.stats?.avgSession || 0) * (site.stats?.pageviews || 0)),
      totalVisits: (acc.totalVisits || 0) + (site.stats?.pageviews || 0),
    }),
    { pageviews: 0, uniques: 0, bounces: 0, totalTime: 0, totalVisits: 0 }
  );

  const bounceRate = aggregated.totalVisits > 0 
    ? Math.round((aggregated.bounces / aggregated.totalVisits) * 100) 
    : 0;
  const avgSession = aggregated.totalVisits > 0 
    ? Math.round(aggregated.totalTime / aggregated.totalVisits) 
    : 0;

  const calcTrend = (current: number, previous: number) => {
    if (!previous || previous === 0) return null;
    return Math.round(((current - previous) / previous) * 100);
  };

  const trends = {
    pageviews: null,
    uniques: null,
    bounceRate: null,
    avgSession: null,
  };

  const prevParams = getPreviousRangeParams(range);
  if (prevParams && validResults.length > 0) {
    try {
      const prevResults = await Promise.all(
        websites.map(async (site) => {
          try {
            const prevStats = await getStatsForRange(site.id, prevParams.startAt, prevParams.endAt);
            return { ...site, stats: prevStats };
          } catch {
            return { ...site, stats: null };
          }
        })
      );
      const prevValid = prevResults.filter(r => r.stats !== null);
      const prevAggregated = prevValid.reduce(
        (acc, site) => ({
          pageviews: acc.pageviews + (site.stats?.pageviews || 0),
          uniques: acc.uniques + (site.stats?.uniques || 0),
          bounces: (acc.bounces || 0) + (site.stats?.bounceRate ? Math.round((site.stats?.pageviews || 0) * site.stats.bounceRate / 100) : 0),
          totalTime: (acc.totalTime || 0) + ((site.stats?.avgSession || 0) * (site.stats?.pageviews || 0)),
          totalVisits: (acc.totalVisits || 0) + (site.stats?.pageviews || 0),
        }),
        { pageviews: 0, uniques: 0, bounces: 0, totalTime: 0, totalVisits: 0 }
      );
      const prevBounceRate = prevAggregated.totalVisits > 0 ? Math.round((prevAggregated.bounces / prevAggregated.totalVisits) * 100) : 0;
      const prevAvgSession = prevAggregated.totalVisits > 0 ? Math.round(prevAggregated.totalTime / prevAggregated.totalVisits) : 0;

      trends.pageviews = calcTrend(aggregated.pageviews, prevAggregated.pageviews);
      trends.uniques = calcTrend(aggregated.uniques, prevAggregated.uniques);
      trends.bounceRate = calcTrend(bounceRate, prevBounceRate);
      trends.avgSession = calcTrend(avgSession, prevAvgSession);
    } catch (e) {
      console.warn('Failed to calculate trends for all websites');
    }
  }

  return {
    aggregated: {
      pageviews: aggregated.pageviews,
      uniques: aggregated.uniques,
      bounceRate,
      avgSession,
      trends,
    },
    websites: validResults,
  };
}

async function getStatsForRange(websiteId: string, startAt: number, endAt: number) {
  if (!UMAMI_API_CLIENT_ENDPOINT || !websiteId) {
    throw new Error('Missing required Umami API environment variables');
  }
  const url = `${UMAMI_API_CLIENT_ENDPOINT}websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`;
  const data = await httpGet<any>(url);
  return {
    pageviews: data.pageviews?.value ?? data.pageviews ?? 0,
    uniques: data.visitors?.value ?? data.visitors ?? 0,
    bounceRate: data.visits > 0 ? Math.round(((data.bounces ?? 0) / data.visits) * 100) : 0,
    avgSession: data.visits > 0 ? Math.round((data.totaltime ?? 0) / data.visits) : 0,
  };
}

export async function getAllWebsitesPageviews(range: string) {
  const websites = await getWebsites();
  
  const results = await Promise.all(
    websites.map(async (site) => {
      try {
        const pageviews = await getPageviews(range, site.id);
        return { id: site.id, name: site.name, pageviews };
      } catch (error) {
        console.error(`Failed to get pageviews for ${site.name}:`, error);
        return { id: site.id, name: site.name, pageviews: [] };
      }
    })
  );

  if (results.length === 0) return [];

  const aggregatedByDate: Record<string, { pageviews: number; uniques: number }> = {};

  for (const site of results) {
    for (const pv of site.pageviews) {
      const date = pv.date;
      if (!aggregatedByDate[date]) {
        aggregatedByDate[date] = { pageviews: 0, uniques: 0 };
      }
      aggregatedByDate[date].pageviews += pv.pageviews;
      aggregatedByDate[date].uniques += pv.uniques;
    }
  }

  return Object.entries(aggregatedByDate)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

