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
    <Card className="col-span-4">
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}

function TrafficChart({ data }: { data: AnalyticsData }) {
  const chartConfig = {
    pageviews: {
      label: "Pageviews",
      color: "hsl(var(--chart-1))",
    },
    visitors: {
      label: "Visitors",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Traffic Overview</CardTitle>
        <CardDescription>Last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
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
    <Card className="col-span-2">
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

function TopPages({ data }: { data: AnalyticsData }) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Top Pages</CardTitle>
        <CardDescription>Most viewed pages</CardDescription>
      </CardHeader>
      <CardContent>
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
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Top Referrers</CardTitle>
        <CardDescription>Traffic sources</CardDescription>
      </CardHeader>
      <CardContent>
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
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Devices</CardTitle>
        <CardDescription>Traffic by device type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ChartContainer
            config={{
              desktop: { label: "Desktop", color: COLORS[0] },
              mobile: { label: "Mobile", color: COLORS[1] },
              tablet: { label: "Tablet", color: COLORS[2] },
            }}
            className="h-48"
          >
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                outerRadius={80}
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
          <div className="space-y-2">
            {deviceData.map((device, index) => (
              <div
                key={device.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <device.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{device.name}</span>
                </div>
                <span className="font-medium">
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
    <Card className="col-span-2">
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
    <Card className="col-span-2">
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

function BrowsersChart({ data }: { data: AnalyticsData }) {
  const chartConfig = {
    percentage: {
      label: "Percentage",
      color: "hsl(var(--chart-4))",
    },
  };

  return (
    <Card className="col-span-2">
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
  const { data, isLoading } = useSWR<AnalyticsData>("/api/analytics", fetcher);

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    );
  }

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
