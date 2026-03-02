import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const mockViewsData = Array.from({ length: 28 }, (_, i) => ({
  day: `${i + 1}`,
  views: Math.floor(Math.random() * 800 + 50),
  watchTime: Math.floor(Math.random() * 300 + 20),
  subscribers: Math.floor(Math.random() * 10),
}));

const trafficSources = [
  { name: "YouTube search", value: 42, color: "hsl(213, 94%, 55%)" },
  { name: "Suggested videos", value: 28, color: "hsl(145, 63%, 49%)" },
  { name: "External", value: 15, color: "hsl(0, 100%, 50%)" },
  { name: "Browse features", value: 10, color: "hsl(45, 93%, 47%)" },
  { name: "Other", value: 5, color: "hsl(0, 0%, 50%)" },
];

export default function Analytics() {
  const { user } = useAuth();

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

  const totalViews = videos?.reduce((s, v) => s + (v.views || 0), 0) || 0;
  const totalWatchTime = Math.floor(totalViews * 2.5);

  return (
    <div className="space-y-6 max-w-6xl">
      <h1 className="text-2xl font-medium text-foreground">Channel analytics</h1>

      <Tabs defaultValue="overview">
        <TabsList className="bg-secondary border-border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-accent">Overview</TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-accent">Content</TabsTrigger>
          <TabsTrigger value="audience" className="data-[state=active]:bg-accent">Audience</TabsTrigger>
          <TabsTrigger value="revenue" className="data-[state=active]:bg-accent">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">Views</p>
                <p className="text-2xl font-semibold text-foreground mt-1">{totalViews}</p>
                <p className="text-xs text-yt-green mt-1">Last 28 days</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">Watch time (hours)</p>
                <p className="text-2xl font-semibold text-foreground mt-1">{totalWatchTime}</p>
                <p className="text-xs text-yt-green mt-1">Last 28 days</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">Subscribers</p>
                <p className="text-2xl font-semibold text-foreground mt-1">+{Math.floor(Math.random() * 50 + 5)}</p>
                <p className="text-xs text-yt-green mt-1">Last 28 days</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Views</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={mockViewsData}>
                  <defs>
                    <linearGradient id="areaBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(213, 94%, 55%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(213, 94%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
                  <XAxis dataKey="day" stroke="hsl(0, 0%, 40%)" fontSize={11} tickLine={false} />
                  <YAxis stroke="hsl(0, 0%, 40%)" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(0, 0%, 15.7%)", border: "1px solid hsl(0, 0%, 20%)", borderRadius: "8px", color: "#fff", fontSize: 12 }} />
                  <Area type="monotone" dataKey="views" stroke="hsl(213, 94%, 55%)" fill="url(#areaBlue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base text-foreground">Traffic sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={trafficSources} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" strokeWidth={0}>
                        {trafficSources.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {trafficSources.map((s) => (
                      <div key={s.name} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-foreground">{s.name}</span>
                        <span className="text-muted-foreground ml-auto">{s.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base text-foreground">Top videos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {!videos?.length ? (
                  <p className="text-muted-foreground text-sm text-center py-4">No videos yet</p>
                ) : (
                  videos.slice(0, 5).map((v, i) => (
                    <div key={v.id} className="flex items-center gap-3 p-2 rounded hover:bg-accent">
                      <span className="text-muted-foreground text-sm w-5">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{v.title}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{v.views || 0} views</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-base text-foreground">Watch time by content</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={mockViewsData.slice(0, 14)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
                  <XAxis dataKey="day" stroke="hsl(0, 0%, 40%)" fontSize={11} />
                  <YAxis stroke="hsl(0, 0%, 40%)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "hsl(0, 0%, 15.7%)", border: "1px solid hsl(0, 0%, 20%)", borderRadius: "8px", color: "#fff", fontSize: 12 }} />
                  <Bar dataKey="watchTime" fill="hsl(213, 94%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-base text-foreground">New subscribers</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={mockViewsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
                  <XAxis dataKey="day" stroke="hsl(0, 0%, 40%)" fontSize={11} />
                  <YAxis stroke="hsl(0, 0%, 40%)" fontSize={11} />
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
