import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const mockViewsData = Array.from({ length: 28 }, (_, i) => ({
  day: `${i + 1}`,
  views: Math.floor(Math.random() * 800 + 50),
  watchTime: Math.floor(Math.random() * 300 + 20),
  subscribers: Math.floor(Math.random() * 10),
  revenue: Math.floor(Math.random() * 50 + 5),
}));

const trafficSources = [
  { name: "YouTube search", value: 42, color: "hsl(213, 94%, 55%)" },
  { name: "Suggested videos", value: 28, color: "hsl(145, 63%, 49%)" },
  { name: "External", value: 15, color: "hsl(0, 100%, 50%)" },
  { name: "Browse features", value: 10, color: "hsl(45, 93%, 47%)" },
  { name: "Other", value: 5, color: "hsl(0, 0%, 50%)" },
];

const demographics = [
  { age: "13-17", male: 5, female: 3 },
  { age: "18-24", male: 35, female: 20 },
  { age: "25-34", male: 18, female: 8 },
  { age: "35-44", male: 5, female: 3 },
  { age: "45+", male: 2, female: 1 },
];

const topCountries = [
  { country: "India", percent: 72 },
  { country: "United States", percent: 8 },
  { country: "Bangladesh", percent: 5 },
  { country: "Nepal", percent: 3 },
  { country: "United Kingdom", percent: 2 },
];

export default function Analytics() {
  const { user } = useAuth();
  const [period, setPeriod] = useState("28d");

  const { data: videos } = useQuery({
    queryKey: ["analytics-videos", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("videos")
        .select("*")
        .eq("user_id", user!.id)
        .order("views", { ascending: false })
        .limit(10);
      return data || [];
    },
    enabled: !!user,
  });

  const totalViews = videos?.reduce((s, v) => s + (v.views || 0), 0) || 71300;
  const totalWatchTime = Math.floor(totalViews * 2.5);

  const dummyTopVideos = [
    { id: "t1", title: "Python Full Course for Beginners", views: 25600 },
    { id: "t2", title: "Hostel Room Tour - IIT Life", views: 15300 },
    { id: "t3", title: "DSA in One Shot - Complete Roadmap 2026", views: 12400 },
    { id: "t4", title: "How I Got 95% in Semester Exams", views: 9800 },
    { id: "t5", title: "College Vlog #12 - Fest Preparation", views: 8200 },
  ];

  const displayTopVideos = videos?.length ? videos.slice(0, 5) : dummyTopVideos;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-medium text-foreground">Channel analytics</h1>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="bg-secondary border-border w-auto min-w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="28d">Last 28 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="365d">Last 365 days</SelectItem>
            <SelectItem value="lifetime">Lifetime</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview">
        <div className="overflow-x-auto -mx-6 px-6">
          <TabsList className="bg-secondary border-border flex w-max gap-1 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-accent text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-accent text-xs sm:text-sm">Content</TabsTrigger>
            <TabsTrigger value="audience" className="data-[state=active]:bg-accent text-xs sm:text-sm">Audience</TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-accent text-xs sm:text-sm">Revenue</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Views", value: totalViews.toLocaleString(), change: "+12.3%", up: true },
              { label: "Watch time (hrs)", value: totalWatchTime.toLocaleString(), change: "+8.7%", up: true },
              { label: "Subscribers", value: "+48", change: "+15.2%", up: true },
              { label: "Avg view duration", value: "4:32", change: "-2.1%", up: false },
            ].map((stat) => (
              <Card key={stat.label} className="bg-card border-border">
                <CardContent className="pt-4 pb-3">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg sm:text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
                  <p className={`text-[10px] sm:text-xs mt-1 flex items-center gap-0.5 ${stat.up ? "text-yt-green" : "text-yt-red"}`}>
                    {stat.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-base text-foreground">Views</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={mockViewsData}>
                  <defs>
                    <linearGradient id="areaBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(213, 94%, 55%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(213, 94%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
                  <XAxis dataKey="day" stroke="hsl(0, 0%, 40%)" fontSize={11} tickLine={false} interval={3} />
                  <YAxis stroke="hsl(0, 0%, 40%)" fontSize={11} tickLine={false} width={40} />
                  <Tooltip contentStyle={{ background: "hsl(0, 0%, 15.7%)", border: "1px solid hsl(0, 0%, 20%)", borderRadius: "8px", color: "#fff", fontSize: 12 }} />
                  <Area type="monotone" dataKey="views" stroke="hsl(213, 94%, 55%)" fill="url(#areaBlue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-base text-foreground">Traffic sources</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <ResponsiveContainer width={140} height={140}>
                    <PieChart>
                      <Pie data={trafficSources} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" strokeWidth={0}>
                        {trafficSources.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 flex-1">
                    {trafficSources.map((s) => (
                      <div key={s.name} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-foreground flex-1">{s.name}</span>
                        <span className="text-muted-foreground">{s.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-base text-foreground">Top videos</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {displayTopVideos.map((v: any, i: number) => (
                  <div key={v.id} className="flex items-center gap-3 p-2 rounded hover:bg-accent">
                    <span className="text-muted-foreground text-sm w-5">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{v.title}</p>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{(v.views || 0).toLocaleString()}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-6 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-base text-foreground">Watch time by content</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockViewsData.slice(0, 14)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
                  <XAxis dataKey="day" stroke="hsl(0, 0%, 40%)" fontSize={11} />
                  <YAxis stroke="hsl(0, 0%, 40%)" fontSize={11} width={40} />
                  <Tooltip contentStyle={{ background: "hsl(0, 0%, 15.7%)", border: "1px solid hsl(0, 0%, 20%)", borderRadius: "8px", color: "#fff", fontSize: 12 }} />
                  <Bar dataKey="watchTime" fill="hsl(213, 94%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-base text-foreground">Age & gender</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={demographics} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
                    <XAxis type="number" stroke="hsl(0, 0%, 40%)" fontSize={11} />
                    <YAxis dataKey="age" type="category" stroke="hsl(0, 0%, 40%)" fontSize={11} width={40} />
                    <Tooltip contentStyle={{ background: "hsl(0, 0%, 15.7%)", border: "1px solid hsl(0, 0%, 20%)", borderRadius: "8px", color: "#fff", fontSize: 12 }} />
                    <Bar dataKey="male" fill="hsl(213, 94%, 55%)" radius={[0, 4, 4, 0]} name="Male" />
                    <Bar dataKey="female" fill="hsl(340, 82%, 52%)" radius={[0, 4, 4, 0]} name="Female" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 mt-2 justify-center">
                  <div className="flex items-center gap-1.5 text-xs"><div className="w-3 h-3 rounded bg-yt-blue" /> Male</div>
                  <div className="flex items-center gap-1.5 text-xs"><div className="w-3 h-3 rounded" style={{ background: "hsl(340, 82%, 52%)" }} /> Female</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-base text-foreground">Top countries</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {topCountries.map((c) => (
                  <div key={c.country} className="flex items-center gap-3">
                    <span className="text-sm text-foreground flex-1">{c.country}</span>
                    <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-yt-blue rounded-full" style={{ width: `${c.percent}%` }} />
                    </div>
                    <span className="text-sm text-muted-foreground w-10 text-right">{c.percent}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-base text-foreground">New subscribers</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={mockViewsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
                  <XAxis dataKey="day" stroke="hsl(0, 0%, 40%)" fontSize={11} interval={3} />
                  <YAxis stroke="hsl(0, 0%, 40%)" fontSize={11} width={40} />
                  <Tooltip contentStyle={{ background: "hsl(0, 0%, 15.7%)", border: "1px solid hsl(0, 0%, 20%)", borderRadius: "8px", color: "#fff", fontSize: 12 }} />
                  <Area type="monotone" dataKey="subscribers" stroke="hsl(145, 63%, 49%)" fill="hsl(145, 63%, 49%)" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Revenue data will appear here once your channel is monetized.</p>
              <p className="text-xs text-muted-foreground mt-2">You need at least 1,000 subscribers and 4,000 watch hours to apply.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
