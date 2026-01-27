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

// Cloudflare zone quota: adaptive analytics cannot request data older than 8 days (691200s).
// See: "zone cannot request data older than 691200s" GraphQL error.
const ADAPTIVE_MAX_AGE_SECONDS = 691200;

const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  "United States": "us",
  "United Kingdom": "gb",
  "India": "in",
  "Canada": "ca",
  "Germany": "de",
  "France": "fr",
  "Japan": "jp",
  "China": "cn",
  "Australia": "au",
  "Brazil": "br",
  "Russia": "ru",
  "South Korea": "kr",
  "Italy": "it",
  "Spain": "es",
  "Netherlands": "nl",
  "Switzerland": "ch",
  "Sweden": "se",
  "Norway": "no",
  "Denmark": "dk",
  "Finland": "fi",
  "Ireland": "ie",
  "New Zealand": "nz",
  "Singapore": "sg",
  "United Arab Emirates": "ae",
  "Saudi Arabia": "sa",
  "South Africa": "za",
  "Mexico": "mx",
  "Argentina": "ar",
  "Turkey": "tr",
  "Portugal": "pt",
  "Belgium": "be",
  "Austria": "at",
  "Thailand": "th",
  "Vietnam": "vn",
  "Indonesia": "id",
  "Malaysia": "my",
  "Philippines": "ph",
  "Poland": "pl",
  "Czech Republic": "cz",
  "Greece": "gr",
  "Israel": "il",
  "Ukraine": "ua",
  "Hong Kong": "hk",
  "Taiwan": "tw",
  "Pakistan": "pk",
  "Egypt": "eg",
  "Nigeria": "ng",
  "Sri Lanka": "lk",
  "Unknown": "un"
};

// Reverse lookup: country code to name
const CODE_TO_COUNTRY_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(COUNTRY_NAME_TO_CODE).map(([name, code]) => [code.toLowerCase(), name])
);

function getCountryCode(name: string): string {
  // If it's already a 2-letter code, return it lowercased
  if (name.length === 2) return name.toLowerCase();

  if (COUNTRY_NAME_TO_CODE[name]) return COUNTRY_NAME_TO_CODE[name];
  // Basic search for common variations
  const lowerName = name.toLowerCase();
  for (const [key, code] of Object.entries(COUNTRY_NAME_TO_CODE)) {
    if (key.toLowerCase() === lowerName) return code;
  }
  return "un";
}

function getCountryName(nameOrCode: string): string {
  // If it's a 2-letter code, look up the name
  if (nameOrCode.length === 2) {
    const code = nameOrCode.toLowerCase();
    return CODE_TO_COUNTRY_NAME[code] || nameOrCode;
  }
  // Otherwise return as-is (it's already a name)
  return nameOrCode;
}

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

function getEmptyData(days: number = 30) {
  const now = new Date();
  const history = Array.from({ length: days }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (days - 1 - i));
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

  // 1. Validation and time range (Cloudflare-style: 24h, 7d, 30d)
  const daysParam = request.nextUrl.searchParams.get("days");
  const days = Math.min(
    30,
    Math.max(1, daysParam ? parseInt(daysParam, 10) : 7)
  ) || 7;
  if (!zoneId || !apiToken) {
    console.warn("Cloudflare credentials missing in environment variables.");
    return NextResponse.json(getEmptyData(days));
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
              limit: 10000
              filter: {
                datetime_geq: $startDateTime
                datetime_lt: $endDateTime
              }
            ) {
              dimensions {
                datetime
                clientDeviceType
                userAgent
                clientRequestPath
                clientRequestHTTPHost
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

    // 3. Fetch Data (Parallel for summary, adaptive will be fetched separately)
    const [resMain, resCompare] = await Promise.all([
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
    ]);

    const zoneCurrent = resMain.data?.viewer?.zones?.[0];
    const zonePrev = resCompare.data?.viewer?.zones?.[0];

    if (!zoneCurrent) {
      return NextResponse.json(getEmptyData(days));
    }

    // 4. Transform Data
    const history = zoneCurrent.httpRequests1dGroups?.map((d: any) => ({
      date: d.dimensions.date,
      pageviews: d.sum.pageViews || d.sum.requests || 0,
      visitors: d.uniq.uniques || 0,
    })) || [];

    // Use adaptive data by fetching in 1-day chunks. Cloudflare only allows data
    // from the last ADAPTIVE_MAX_AGE_SECONDS (8 days); older chunks would hit quota errors.
    const chunkedAdaptiveData: any[] = [];
    const chunks: { start: string; end: string }[] = [];

    const endDateObj = new Date();
    const startDateObj = new Date();
    startDateObj.setDate(startDateObj.getDate() - days);

    const adaptiveEarliest = new Date(Date.now() - ADAPTIVE_MAX_AGE_SECONDS * 1000);
    const effectiveStart = startDateObj < adaptiveEarliest ? adaptiveEarliest : startDateObj;

    // Generate daily chunks (only within the allowed adaptive window)
    let current = new Date(effectiveStart);
    while (current < endDateObj) {
      const next = new Date(current);
      next.setDate(next.getDate() + 1);

      // Ensure we don't go past the final end date
      const chunkEnd = next > endDateObj ? endDateObj : next;

      chunks.push({
        start: current.toISOString(),
        end: chunkEnd.toISOString()
      });
      current = next;
    }

    // Fetch chunks with rate limiting (Cloudflare limits complexity/rate)
    const BATCH_SIZE = 3;
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);

      // Add a small delay between batches to respect rate limits
      if (i > 0) await new Promise(resolve => setTimeout(resolve, 250));

      const results = await Promise.all(
        batch.map(chunk =>
          fetchCloudflareAnalytics(queryAdaptive, {
            zoneTag: zoneId,
            startDateTime: chunk.start,
            endDateTime: chunk.end,
          }).catch(err => {
            const msg = err instanceof Error ? err.message : String(err);
            console.warn(`Analytics chunk failed (${chunk.start}): ${msg}`);
            return { data: { viewer: { zones: [{ httpRequestsAdaptiveGroups: [] }] } } };
          })
        )
      );

      results.forEach(res => {
        const groups = res.data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups || [];
        chunkedAdaptiveData.push(...groups);
      });
    }

    const rawData = chunkedAdaptiveData;

    const deviceCounts: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
    const browserCounts: Record<string, number> = {};
    const countryCounts: Record<string, { views: number; visitors: number; code: string }> = {};
    const pageCounts: Record<string, { views: number; visitors: number }> = {};
    const referrerCounts: Record<string, number> = {};

    rawData.forEach((item: any) => {
      const views = item.count || 0;
      // Note: Unique visitors are not available in httpRequestsAdaptiveGroups
      // We'll use views as an approximation for visitors in top pages/countries
      const visitors = views;

      const type = item.dimensions.clientDeviceType?.toLowerCase() || 'desktop';
      if (type.includes('mobile')) deviceCounts.mobile += views;
      else if (type.includes('tablet')) deviceCounts.tablet += views;
      else deviceCounts.desktop += views;

      const browser = getBrowserFromUA(item.dimensions.userAgent);
      browserCounts[browser] = (browserCounts[browser] || 0) + views;

      const countryNameFull = item.dimensions.clientCountryName || 'Unknown';
      const code = getCountryCode(countryNameFull); // Fallback-based, but reliable enough for now

      const countryName = getCountryName(countryNameFull);
      if (!countryCounts[countryName]) countryCounts[countryName] = { views: 0, visitors: 0, code };
      countryCounts[countryName].views += views;
      countryCounts[countryName].visitors += visitors;

      let path = item.dimensions.clientRequestPath || '/';

      // Filter out system paths, assets, and internal routes
      const isSystemPath =
        path.startsWith('/_next') ||
        path.startsWith('/_vercel') ||
        path.startsWith('/.well-known') ||
        path.startsWith('/cdn-cgi');

      // Prettify paths
      if (path === '/') path = 'Home';
      else if (path === '/work') path = 'Our Portfolio';
      else if (path === '/about') path = 'About Us';
      else if (path === '/contact') path = 'Contact';

      if (!isSystemPath) {
        if (!pageCounts[path]) pageCounts[path] = { views: 0, visitors: 0 };
        pageCounts[path].views += views;
        pageCounts[path].visitors += visitors;
      }

      // Note: Referrer data is not available for this zone plan in httpRequestsAdaptiveGroups
      // Fallback to counting all as Direct or Unknown to prevent crashing
      referrerCounts['Direct'] = (referrerCounts['Direct'] || 0) + views;
    });

    const topReferrers = Object.entries(referrerCounts)
      .map(([source, views]) => ({ source, views: views as number }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // If no referrers, return empty array instead of showing "Direct" with 0
    const topReferrersFiltered = topReferrers.filter(r => r.views > 0);

    const totalDevices = deviceCounts.desktop + deviceCounts.mobile + deviceCounts.tablet;
    const devices = totalDevices > 0 ? {
      desktop: (deviceCounts.desktop / totalDevices) * 100,
      mobile: (deviceCounts.mobile / totalDevices) * 100,
      tablet: (deviceCounts.tablet / totalDevices) * 100,
    } : { desktop: 0, mobile: 0, tablet: 0 };

    const totalBrowserViews = Object.values(browserCounts).reduce((a, b) => a + b, 0);

    const browsers = Object.entries(browserCounts)
      .map(([name, val]) => ({ name, percentage: totalBrowserViews > 0 ? ((val as number) / totalBrowserViews) * 100 : 0 }))
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

    const prevTotalViews = zonePrev?.httpRequests1dGroups?.reduce((acc: number, d: any) => acc + (d.sum.pageViews || d.sum.requests || 0), 0) || 0;
    const prevTotalVisitors = zonePrev?.httpRequests1dGroups?.reduce((acc: number, d: any) => acc + (d.uniq.uniques || 0), 0) || 0;

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
      topPages: topPages.length > 0 ? topPages : [],
      topCountries: topCountries.length > 0 ? topCountries : [],
      topReferrers: topReferrersFiltered.length > 0 ? topReferrersFiltered : [],
      devices,
      browsers: browsers.length > 0 ? browsers : [],
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

    return NextResponse.json({ ...getEmptyData(30), error: cleanMessage }, { status: 500 });
  }
}
