"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import useSWR from "swr";
import { Suspense, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MousePointerClick,
  Clock,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Download,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type AnalyticsData = {
  summary: {
    pageviews: { total: number; change: number };
    visitors: { total: number; change: number };
    bounceRate: { value: number; change: number };
    avgSessionDuration: { value: number; change: number };
  };
  traffic: {
    last7Days: Array<{ date: string; pageviews: number; visitors: number }>;
    last30Days: Array<{ date: string; pageviews: number; visitors: number }>;
  };
  topPages: Array<{ path: string; views: number; visitors: number }>;
  topReferrers: Array<{ source: string; views: number }>;
  topCountries: Array<{ country: string; views: number; visitors: number }>;
  devices: { desktop: number; mobile: number; tablet: number };
  browsers: Array<{ name: string; percentage: number }>;
};

function MetricCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
}

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  formatter,
}: {
  title: string;
  value: number;
  change: number;
  icon: React.ElementType;
  formatter?: (value: number) => string;
}) {
  const isPositive = change >= 0;
  const formattedValue = formatter ? formatter(value) : value.toLocaleString();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          {isPositive ? (
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
          )}
          <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="ml-1">from last period</span>
        </div>
      </CardContent>
    </Card>
  );
}

function TrafficChartSkeleton() {
  return (
    <Card className="col-span-1 sm:col-span-4">
      <CardHeader className="pb-2 sm:pb-6">
        <Skeleton className="h-4 sm:h-5 w-28 sm:w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-48 sm:h-64 w-full" />
      </CardContent>
    </Card>
  );
}

function TrafficChart({ data }: { data: AnalyticsData }) {
  const chartConfig = {
    pageviews: {
      label: "Pageviews",
      color: "#000080", // Navy Blue
    },
    visitors: {
      label: "Visitors",
      color: "#3b82f6", // Bright Blue for contrast
    },
  };

  return (
    <Card className="col-span-1 sm:col-span-4">
      <CardHeader className="pb-2 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">Traffic Overview</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Last 7 days</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 sm:pt-2">
        <ChartContainer config={chartConfig}>
          <AreaChart data={data.traffic.last7Days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="pageviews"
              stroke={chartConfig.pageviews.color}
              fill={chartConfig.pageviews.color}
              fillOpacity={0.2}
            />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke={chartConfig.visitors.color}
              fill={chartConfig.visitors.color}
              fillOpacity={0.2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function TopPagesSkeleton() {
  return (
    <Card className="col-span-1 sm:col-span-2">
      <CardHeader className="pb-2 sm:pb-6">
        <Skeleton className="h-4 sm:h-5 w-28 sm:w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 sm:h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TopPages({ data }: { data: AnalyticsData }) {
  return (
    <Card className="col-span-1 sm:col-span-2">
      <CardHeader className="pb-2 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">Top Pages</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Most viewed pages</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.topPages.map((page) => (
              <TableRow key={page.path}>
                <TableCell className="font-medium">{page.path}</TableCell>
                <TableCell className="text-right">
                  {page.views.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {page.visitors.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TopReferrersSkeleton() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TopReferrers({ data }: { data: AnalyticsData }) {
  const chartConfig = {
    views: {
      label: "Views",
      color: "#1e3a8a", // Deep Navy
    },
  };

  return (
    <Card className="col-span-1 sm:col-span-2">
      <CardHeader className="pb-2 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">Top Referrers</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Traffic sources</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig}>
          <BarChart data={data.topReferrers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="views" fill={chartConfig.views.color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function DevicesChartSkeleton() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-48 w-full" />
      </CardContent>
    </Card>
  );
}

function DevicesChart({ data }: { data: AnalyticsData }) {
  const deviceData = [
    { name: "Desktop", value: data.devices.desktop, icon: Monitor },
    { name: "Mobile", value: data.devices.mobile, icon: Smartphone },
    { name: "Tablet", value: data.devices.tablet, icon: Tablet },
  ];

  // Using dark, distinct colors - gray for desktop, blue for mobile, darker blue for tablet
  const COLORS = ["#4b5563", "#2563eb", "#1e40af"];

  return (
    <Card className="col-span-1 sm:col-span-2">
      <CardHeader className="pb-2 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">Devices</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Traffic by device type</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <ChartContainer
            config={{
              desktop: { label: "Desktop", color: COLORS[0] },
              mobile: { label: "Mobile", color: COLORS[1] },
              tablet: { label: "Tablet", color: COLORS[2] },
            }}
            className="h-32 sm:h-48 w-full sm:flex-1"
          >
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={50}
                dataKey="value"
              >
                {deviceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
          <div className="space-y-1.5 sm:space-y-2 flex-shrink-0">
            {deviceData.map((device, index) => (
              <div
                key={device.name}
                className="flex items-center justify-between gap-4 sm:gap-8"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <device.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  <span className="text-xs sm:text-sm">{device.name}</span>
                </div>
                <span className="font-medium text-xs sm:text-sm tabular-nums">
                  {device.value.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TopCountriesSkeleton() {
  return (
    <Card className="col-span-1 sm:col-span-2">
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TopCountries({ data }: { data: AnalyticsData }) {
  return (
    <Card className="col-span-1 sm:col-span-2">
      <CardHeader>
        <CardTitle>Top Countries</CardTitle>
        <CardDescription>Traffic by country</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.topCountries.map((country) => (
              <TableRow key={country.country}>
                <TableCell className="font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  {country.country}
                </TableCell>
                <TableCell className="text-right">
                  {country.views.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {country.visitors.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function BrowsersChartSkeleton() {
  return (
    <Card className="col-span-1 sm:col-span-2">
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-48 w-full" />
      </CardContent>
    </Card>
  );
}

function BrowsersChart({ data }: { data: AnalyticsData }) {
  const chartConfig = {
    percentage: {
      label: "Percentage",
      color: "#1e40af", // Premium Navy
    },
  };

  return (
    <Card className="col-span-1 sm:col-span-2">
      <CardHeader>
        <CardTitle>Browsers</CardTitle>
        <CardDescription>Traffic by browser</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data.browsers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="percentage" fill={chartConfig.percentage.color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function AnalyticsDashboard() {
  const { data, error, isLoading } = useSWR<AnalyticsData & { error?: string }>("/api/analytics", fetcher);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error || (data && data.error)) {
    return (
      <Card className="border-destructive/50 bg-destructive/5 text-destructive">
        <CardHeader>
          <CardTitle className="text-lg">Failed to load analytics</CardTitle>
          <CardDescription className="text-destructive/80">
            {error?.message || data?.error || "An unknown error occurred while fetching Cloudflare data."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p>Please check your Cloudflare credentials in <code>.env.local</code>:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><code>CLOUDFLARE_ZONE_ID</code></li>
              <li><code>CLOUDFLARE_API_TOKEN</code> (Ensure it has "Analytics:Read" permissions)</li>
            </ul>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
        <MetricCard
          title="Pageviews"
          value={data.summary.pageviews.total}
          change={data.summary.pageviews.change}
          icon={Eye}
        />
        <MetricCard
          title="Visitors"
          value={data.summary.visitors.total}
          change={data.summary.visitors.change}
          icon={Users}
        />
        <MetricCard
          title="Bounce Rate"
          value={data.summary.bounceRate.value}
          change={data.summary.bounceRate.change}
          icon={MousePointerClick}
          formatter={(value) => `${value.toFixed(1)}%`}
        />
        <MetricCard
          title="Avg. Session Duration"
          value={data.summary.avgSessionDuration.value}
          change={data.summary.avgSessionDuration.change}
          icon={Clock}
          formatter={formatDuration}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
        <Suspense fallback={<TrafficChartSkeleton />}>
          <TrafficChart data={data} />
        </Suspense>
        <Suspense fallback={<TopPagesSkeleton />}>
          <TopPages data={data} />
        </Suspense>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
        <Suspense fallback={<TopReferrersSkeleton />}>
          <TopReferrers data={data} />
        </Suspense>
        <Suspense fallback={<DevicesChartSkeleton />}>
          <DevicesChart data={data} />
        </Suspense>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
        <Suspense fallback={<TopCountriesSkeleton />}>
          <TopCountries data={data} />
        </Suspense>
        <Suspense fallback={<BrowsersChartSkeleton />}>
          <BrowsersChart data={data} />
        </Suspense>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cloudflare Web Analytics</h1>
          <p className="text-muted-foreground">
            Real-time analytics and insights for your website
          </p>
        </div>
      </div>
      <div id="analytics-dashboard">
        <AnalyticsDashboard />
      </div>
    </div>
  );
}
