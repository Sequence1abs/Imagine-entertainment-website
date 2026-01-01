import { NextRequest, NextResponse } from "next/server";

// --- Types & Interfaces ---

interface CloudflareGraphQLResponse {
  data?: {
    viewer?: {
      zones?: {
        httpRequests1dGroups?: Array<{
          dimensions: { date: string };
          sum: { requests: number; pageViews: number };
          uniq: { uniques: number };
        }>;
        httpRequestsAdaptiveGroups?: Array<{
          dimensions: {
            datetime: string;
            clientDeviceType: string;
            userAgent: string;
            clientRequestHTTPHost: string;
            clientRequestPath: string;
            clientCountryName: string;
          };
          count: number;
        }>;
      }[];
    };
  };
  errors?: Array<{ message: string }>;
}

interface DateRange {
  startDate: string;
  endDate: string;
  startDateTime: string;
  endDateTime: string;
}

// --- Constants & Helpers ---

const CLOUDFLARE_API_URL = "https://api.cloudflare.com/client/v4/graphql";

function getDateRange(days: number): DateRange {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    startDateTime: startDate.toISOString(),
    endDateTime: endDate.toISOString(),
  };
}

function getBrowserFromUA(ua: string): string {
  if (!ua) return 'Other';
  const lowerUA = ua.toLowerCase();

  if (lowerUA.includes('chrome') && !lowerUA.includes('edg') && !lowerUA.includes('opr')) return 'Chrome';
  if (lowerUA.includes('safari') && !lowerUA.includes('chrome')) return 'Safari';
  if (lowerUA.includes('firefox')) return 'Firefox';
  if (lowerUA.includes('edg')) return 'Edge';
  if (lowerUA.includes('opr') || lowerUA.includes('opera')) return 'Opera';
  if (lowerUA.includes('trident') || lowerUA.includes('msie')) return 'IE';

  return 'Other';
}

async function fetchCloudflareAnalytics(query: string, variables: Record<string, any>): Promise<CloudflareGraphQLResponse> {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!apiToken) {
    throw new Error("CLOUDFLARE_API_TOKEN is not configured");
  }

  const response = await fetch(CLOUDFLARE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudflare API error: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`Cloudflare GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data;
}

function getEmptyData() {
  const now = new Date();
  const history = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      pageviews: 0,
      visitors: 0,
    };
  });

  return {
    summary: {
      pageviews: { total: 0, change: 0 },
      visitors: { total: 0, change: 0 },
      bounceRate: { value: 0, change: 0 },
      avgSessionDuration: { value: 0, change: 0 },
    },
    traffic: { history },
    topPages: [],
    topReferrers: [],
    topCountries: [],
    devices: { desktop: 0, mobile: 0, tablet: 0 },
    browsers: [],
  };
}

// --- Main Handler ---

export async function GET(request: NextRequest) {
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  // Get range from query params
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30");

  // 1. Validation
  if (!zoneId || !apiToken) {
    console.warn("Cloudflare credentials missing in environment variables.");
    return NextResponse.json(getEmptyData());
  }

  try {
    // 2. Prepare Queries
    const querySummary = `
      query GetSummary($zoneTag: String!, $startDate: Date!, $endDate: Date!) {
        viewer {
          zones(filter: { zoneTag: $zoneTag }) {
            httpRequests1dGroups(
              limit: 100
              filter: {
                date_geq: $startDate
                date_leq: $endDate
              }
              orderBy: [date_ASC]
            ) {
              dimensions { date }
              sum { requests pageViews }
              uniq { uniques }
            }
          }
        }
      }
    `;

    const queryAdaptive = `
      query GetAdaptive($zoneTag: String!, $startDateTime: DateTime!, $endDateTime: DateTime!) {
        viewer {
          zones(filter: { zoneTag: $zoneTag }) {
            httpRequestsAdaptiveGroups(
              limit: 2000
              filter: {
                datetime_geq: $startDateTime
                datetime_lt: $endDateTime
              }
            ) {
              dimensions {
                datetime
                clientDeviceType
                userAgent
                clientRequestHTTPHost
                clientRequestPath
                clientCountryName
              }
              count
            }
          }
        }
      }
    `;

    const rangeMain = getDateRange(days);
    const rangeCompare = getDateRange(days * 2);
    const range1 = getDateRange(1);

    // 3. Fetch Data (Parallel)
    const [resMain, resCompare, res1] = await Promise.all([
      fetchCloudflareAnalytics(querySummary, {
        zoneTag: zoneId,
        startDate: rangeMain.startDate,
        endDate: rangeMain.endDate,
      }),
      fetchCloudflareAnalytics(querySummary, {
        zoneTag: zoneId,
        startDate: rangeCompare.startDate,
        endDate: rangeMain.startDate,
      }),
      fetchCloudflareAnalytics(queryAdaptive, {
        zoneTag: zoneId,
        startDateTime: range1.startDateTime,
        endDateTime: range1.endDateTime,
      }),
    ]);

    const zoneCurrent = resMain.data?.viewer?.zones?.[0];
    const zonePrev = resCompare.data?.viewer?.zones?.[0];
    const zone1 = res1.data?.viewer?.zones?.[0];

    if (!zoneCurrent) {
      return NextResponse.json(getEmptyData());
    }

    // 4. Transform Data
    const history = zoneCurrent.httpRequests1dGroups?.map((d) => ({
      date: d.dimensions.date,
      pageviews: d.sum.requests || 0,
      visitors: d.uniq.uniques || 0,
    })) || [];

    const rawData = zone1?.httpRequestsAdaptiveGroups || [];

    const deviceCounts: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
    const browserCounts: Record<string, number> = {};
    const countryCounts: Record<string, { views: number; visitors: number }> = {};
    const pageCounts: Record<string, { views: number; visitors: number }> = {};
    const referrerCounts: Record<string, number> = {};

    rawData.forEach((item) => {
      const views = item.count || 0;
      const visitors = 0;

      const type = item.dimensions.clientDeviceType?.toLowerCase() || 'desktop';
      if (type.includes('mobile')) deviceCounts.mobile += views;
      else if (type.includes('tablet')) deviceCounts.tablet += views;
      else deviceCounts.desktop += views;

      const browser = getBrowserFromUA(item.dimensions.userAgent);
      browserCounts[browser] = (browserCounts[browser] || 0) + views;

      const country = item.dimensions.clientCountryName || 'Unknown';
      if (!countryCounts[country]) countryCounts[country] = { views: 0, visitors: 0 };
      countryCounts[country].views += views;
      countryCounts[country].visitors += visitors;

      const path = item.dimensions.clientRequestPath || '/';
      if (!pageCounts[path]) pageCounts[path] = { views: 0, visitors: 0 };
      pageCounts[path].views += views;
      pageCounts[path].visitors += visitors;
    });

    const topReferrers = Object.entries(referrerCounts)
      .map(([source, views]) => ({ source, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    const totalDevices = deviceCounts.desktop + deviceCounts.mobile + deviceCounts.tablet;
    const devices = totalDevices > 0 ? {
      desktop: (deviceCounts.desktop / totalDevices) * 100,
      mobile: (deviceCounts.mobile / totalDevices) * 100,
      tablet: (deviceCounts.tablet / totalDevices) * 100,
    } : { desktop: 0, mobile: 0, tablet: 0 };

    const totalBrowserViews = Object.values(browserCounts).reduce((a, b) => a + b, 0);

    const browsers = Object.entries(browserCounts)
      .map(([name, val]) => ({ name, percentage: totalBrowserViews > 0 ? (val / totalBrowserViews) * 100 : 0 }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 6);

    const topCountries = Object.entries(countryCounts)
      .map(([country, data]) => ({ country, ...data }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    const topPages = Object.entries(pageCounts)
      .map(([path, data]) => ({ path, ...data }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // D. Comparison Metrics
    const totalPageviews = history.reduce((acc, d) => acc + d.pageviews, 0);
    const totalVisitors = history.reduce((acc, d) => acc + d.visitors, 0);

    let pageviewsChange = 0;
    let visitorsChange = 0;

    const prevTotalViews = zonePrev?.httpRequests1dGroups?.reduce((acc, d) => acc + (d.sum.requests || 0), 0) || 0;
    const prevTotalVisitors = zonePrev?.httpRequests1dGroups?.reduce((acc, d) => acc + (d.uniq.uniques || 0), 0) || 0;

    if (prevTotalViews > 0) pageviewsChange = ((totalPageviews - prevTotalViews) / prevTotalViews) * 100;
    if (prevTotalVisitors > 0) visitorsChange = ((totalVisitors - prevTotalVisitors) / prevTotalVisitors) * 100;

    return NextResponse.json({
      summary: {
        pageviews: { total: totalPageviews, change: pageviewsChange },
        visitors: { total: totalVisitors, change: visitorsChange },
        bounceRate: { value: 0, change: 0 },
        avgSessionDuration: { value: 0, change: 0 },
      },
      traffic: { history },
      topPages,
      topCountries,
      topReferrers,
      devices,
      browsers,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to load analytics";
    console.error("Analytics API Error:", errorMessage);

    let cleanMessage = errorMessage;
    if (errorMessage.includes("Cloudflare GraphQL errors")) {
      try {
        const errorJson = JSON.parse(errorMessage.split("Cloudflare GraphQL errors: ")[1]);
        if (Array.isArray(errorJson) && errorJson[0]?.message) {
          cleanMessage = `Cloudflare Error: ${errorJson[0].message}`;
        }
      } catch (e) { }
    }

    return NextResponse.json({ ...getEmptyData(), error: cleanMessage }, { status: 500 });
  }
}
