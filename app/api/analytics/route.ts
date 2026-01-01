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

const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  // North America
  "United States": "us", "Canada": "ca", "Mexico": "mx", "Cuba": "cu", "Guatemala": "gt", "Haiti": "ht", "Dominican Republic": "do", "Honduras": "hn", "Nicaragua": "ni", "El Salvador": "sv", "Costa Rica": "cr", "Panama": "pa", "Jamaica": "jm", "Trinidad and Tobago": "tt", "Bahamas": "bs", "Barbados": "bb", "Saint Lucia": "lc", "Saint Vincent and the Grenadines": "vc", "Grenada": "gd", "Antigua and Barbuda": "ag", "Dominica": "dm", "Saint Kitts and Nevis": "kn", "Belize": "bz",

  // South America
  "Brazil": "br", "Colombia": "co", "Argentina": "ar", "Peru": "pe", "Venezuela": "ve", "Chile": "cl", "Ecuador": "ec", "Bolivia": "bo", "Paraguay": "py", "Uruguay": "uy", "Guyana": "gy", "Suriname": "sr",

  // Europe
  "United Kingdom": "gb", "Germany": "de", "France": "fr", "Italy": "it", "Spain": "es", "Poland": "pl", "Ukraine": "ua", "Romania": "ro", "Netherlands": "nl", "Belgium": "be", "Greece": "gr", "Czech Republic": "cz", "Portugal": "pt", "Sweden": "se", "Hungary": "hu", "Belarus": "by", "Austria": "at", "Switzerland": "ch", "Serbia": "rs", "Bulgaria": "bg", "Denmark": "dk", "Finland": "fi", "Slovakia": "sk", "Norway": "no", "Ireland": "ie", "Croatia": "hr", "Moldova": "md", "Bosnia and Herzegovina": "ba", "Albania": "al", "Lithuania": "lt", "Slovenia": "si", "Latvia": "lv", "Estonia": "ee", "Montenegro": "me", "Luxembourg": "lu", "Malta": "mt", "Iceland": "is", "Andorra": "ad", "Monaco": "mc", "Liechtenstein": "li", "San Marino": "sm", "Vatican City": "va", "Russia": "ru", "Turkey": "tr",

  // Asia
  "China": "cn", "India": "in", "Indonesia": "id", "Pakistan": "pk", "Bangladesh": "bd", "Japan": "jp", "Philippines": "ph", "Vietnam": "vn", "Iran": "ir", "Thailand": "th", "Myanmar": "mm", "South Korea": "kr", "Iraq": "iq", "Afghanistan": "af", "Saudi Arabia": "sa", "Uzbekistan": "uz", "Malaysia": "my", "Yemen": "ye", "Nepal": "np", "North Korea": "kp", "Sri Lanka": "lk", "Kazakhstan": "kz", "Syria": "sy", "Cambodia": "kh", "Jordan": "jo", "Azerbaijan": "az", "United Arab Emirates": "ae", "Tajikistan": "tj", "Israel": "il", "Hong Kong": "hk", "Laos": "la", "Lebanon": "lb", "Kyrgyzstan": "kg", "Turkmenistan": "tm", "Singapore": "sg", "Palestine": "ps", "Oman": "om", "Kuwait": "kw", "Georgia": "ge", "Mongolia": "mn", "Armenia": "am", "Qatar": "qa", "Bahrain": "bh", "Timor-Leste": "tl", "Cyprus": "cy", "Bhutan": "bt", "Maldives": "mv", "Brunei": "bn", "Taiwan": "tw", "Macao": "mo",

  // Africa
  "Nigeria": "ng", "Ethiopia": "et", "Egypt": "eg", "DR Congo": "cd", "Tanzania": "tz", "South Africa": "za", "Kenya": "ke", "Uganda": "ug", "Algeria": "dz", "Sudan": "sd", "Morocco": "ma", "Angola": "ao", "Mozambique": "mz", "Ghana": "gh", "Madagascar": "mg", "Ivory Coast": "ci", "Cameroon": "cm", "Niger": "ne", "Burkina Faso": "bf", "Mali": "ml", "Malawi": "mw", "Zambia": "zm", "Senegal": "sn", "Chad": "td", "Somalia": "so", "Zimbabwe": "zw", "Guinea": "gn", "Rwanda": "rw", "Benin": "bj", "Burundi": "bi", "Tunisia": "tn", "South Sudan": "ss", "Togo": "tg", "Sierra Leone": "sl", "Libya": "ly", "Congo": "cg", "Central African Republic": "cf", "Liberia": "lr", "Mauritania": "mr", "Eritrea": "er", "Namibia": "na", "Gambia": "gm", "Botswana": "bw", "Gabon": "ga", "Lesotho": "ls", "Guinea-Bissau": "gw", "Equatorial Guinea": "gq", "Mauritius": "mu", "Eswatini": "sz", "Djibouti": "dj", "Comoros": "km", "Cape Verde": "cv", "Sao Tome and Principe": "st", "Seychelles": "sc",

  // Oceania
  "Australia": "au", "Papua New Guinea": "pg", "New Zealand": "nz", "Fiji": "fj", "Solomon Islands": "sb", "Vanuatu": "vu", "Samoa": "ws", "Kiribati": "ki", "Tonga": "to", "Micronesia": "fm", "Palau": "pw", "Marshall Islands": "mh", "Nauru": "nr", "Tuvalu": "tv",

  "Unknown": "un"
};

function getCountryCode(name: string): string {
  if (COUNTRY_NAME_TO_CODE[name]) return COUNTRY_NAME_TO_CODE[name];
  // Basic search for common variations
  const lowerName = name.toLowerCase();
  for (const [key, code] of Object.entries(COUNTRY_NAME_TO_CODE)) {
    if (key.toLowerCase() === lowerName) return code;
  }
  return "un";
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

  // Get range from query params
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30");

  // 1. Validation
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

    // Diagnostic Log
    console.log(`[Analytics] Fetched ${resMain.data?.viewer?.zones?.[0]?.httpRequests1dGroups?.length || 0} history records`);
    console.log(`[Analytics] Fetched ${res1.data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups?.length || 0} adaptive records`);

    const zoneCurrent = resMain.data?.viewer?.zones?.[0];
    const zonePrev = resCompare.data?.viewer?.zones?.[0];
    const zone1 = res1.data?.viewer?.zones?.[0];

    if (!zoneCurrent) {
      return NextResponse.json(getEmptyData(days));
    }

    // 4. Transform Data
    // A. Fill missing dates in history to ensure a continuous chart
    const historyMap = new Map();
    zoneCurrent.httpRequests1dGroups?.forEach((d: any) => {
      historyMap.set(d.dimensions.date, {
        date: d.dimensions.date,
        pageviews: d.sum.requests || 0,
        visitors: d.uniq.uniques || 0,
      });
    });

    const history = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      history.push(historyMap.get(dateStr) || {
        date: dateStr,
        pageviews: 0,
        visitors: 0,
      });
    }

    const rawData = zone1?.httpRequestsAdaptiveGroups || [];

    const deviceCounts: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
    const browserCounts: Record<string, number> = {};
    const countryCounts: Record<string, { views: number; visitors: number; code: string }> = {};
    const pageCounts: Record<string, { views: number; visitors: number }> = {};
    const referrerCounts: Record<string, number> = {};

    rawData.forEach((item: any) => {
      const views = item.count || 0;
      const visitors = 0;

      const type = item.dimensions.clientDeviceType?.toLowerCase() || 'desktop';
      if (type.includes('mobile')) deviceCounts.mobile += views;
      else if (type.includes('tablet')) deviceCounts.tablet += views;
      else deviceCounts.desktop += views;

      const browser = getBrowserFromUA(item.dimensions.userAgent);
      browserCounts[browser] = (browserCounts[browser] || 0) + views;

      const country = item.dimensions.clientCountryName || 'Unknown';
      const code = getCountryCode(country);
      if (!countryCounts[country]) countryCounts[country] = { views: 0, visitors: 0, code };
      countryCounts[country].views += views;
      countryCounts[country].visitors += visitors;

      const path = item.dimensions.clientRequestPath || '/';
      if (!pageCounts[path]) pageCounts[path] = { views: 0, visitors: 0 };
      pageCounts[path].views += views;
      pageCounts[path].visitors += visitors;
    });

    const topReferrers = Object.entries(referrerCounts)
      .map(([source, views]) => ({ source, views }))
      .sort((a, b) => (b.views as number) - (a.views as number))
      .slice(0, 5);

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

    const prevTotalViews = zonePrev?.httpRequests1dGroups?.reduce((acc: number, d: any) => acc + (d.sum.requests || 0), 0) || 0;
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

    return NextResponse.json({ ...getEmptyData(days), error: cleanMessage }, { status: 500 });
  }
}
