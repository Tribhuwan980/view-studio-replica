import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Eye, ThumbsUp, MessageSquare, Users, TrendingUp, Upload, Clock, Zap, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Badge } from "@/components/ui/badge";

const mockChartData = Array.from({ length: 28 }, (_, i) => ({
  day: `${i + 1}`,
  views: Math.floor(Math.random() * 500 + 100),
  watchTime: Math.floor(Math.random() * 200 + 50),
}));

const dummyLatestVideos = [
  { id: "d1", title: "DSA in One Shot - Complete Roadmap 2026", views: 12400, likes: 890, thumbnail_url: null, upload_date: "2026-02-28" },
  { id: "d2", title: "College Vlog #12 - Fest Preparation 🎉", views: 8200, likes: 650, thumbnail_url: null, upload_date: "2026-02-25" },
  { id: "d3", title: "Python Full Course for Beginners", views: 25600, likes: 1800, thumbnail_url: null, upload_date: "2026-02-20" },
  { id: "d4", title: "Hostel Room Tour - IIT Life", views: 15300, likes: 1200, thumbnail_url: null, upload_date: "2026-02-15" },
  { id: "d5", title: "How I Got 95% in Semester Exams", views: 9800, likes: 720, thumbnail_url: null, upload_date: "2026-02-10" },
];

const dummyComments = [
  { id: "c1", author_name: "Rahul Sharma", content: "Bhai amazing content! DSA wala video bahut helpful tha 🔥", created_at: "2026-03-03" },
  { id: "c2", author_name: "Priya Singh", content: "Can you make a video on System Design for beginners?", created_at: "2026-03-02" },
  { id: "c3", author_name: "Amit Kumar", content: "Your college vlogs are the best! Keep posting bro 💯", created_at: "2026-03-02" },
  { id: "c4", author_name: "Neha Gupta", content: "Which laptop do you use for coding?", created_at: "2026-03-01" },
  { id: "c5", author_name: "Vikram Patel", content: "Subscribed! Your Python course helped me crack my interview 🙏", created_at: "2026-02-28" },
];

const realtimeStats = [
  { label: "Last 48 hours", views: "2.4K", trend: "up" },
  { label: "Active viewers", views: "127", trend: "up" },
];

export default function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const { data: videos } = useQuery({
    queryKey: ["dashboard-videos", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("videos")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: comments } = useQuery({
    queryKey: ["dashboard-comments", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("comments")
        .select("*, videos(title)")
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!user,
  });

  const displayVideos = videos?.length ? videos : dummyLatestVideos;
  const displayComments = comments?.length ? comments : dummyComments;

  const totalViews = videos?.reduce((sum, v) => sum + (v.views || 0), 0) || 71300;
  const totalLikes = videos?.reduce((sum, v) => sum + (v.likes || 0), 0) || 5260;
  const totalComments = videos?.reduce((sum, v) => sum + (v.comments_count || 0), 0) || 342;
  const subscriberCount = profile?.subscriber_count || 1247;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-medium text-foreground">Channel dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {profile?.channel_name || profile?.display_name || "Arjun Creates"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/content")} className="bg-yt-blue hover:bg-yt-blue/90 text-white">
            <Upload className="h-4 w-4 mr-2" /> Upload videos
          </Button>
          <Button variant="outline" onClick={() => navigate("/analytics")} className="border-border text-foreground hidden sm:flex">
            Go to analytics
          </Button>
        </div>
      </div>

      {/* Realtime stats banner */}
      <Card className="bg-card border-border">
        <CardContent className="py-4">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-4 w-4 text-yt-blue" />
            <span className="text-sm font-medium text-foreground">Realtime</span>
            <Badge variant="outline" className="text-xs bg-yt-green/10 text-yt-green border-yt-green/30">Live</Badge>
          </div>
          <div className="flex gap-6 flex-wrap">
            {realtimeStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-semibold text-foreground flex items-center gap-1">
                  {stat.views}
                  {stat.trend === "up" ? <ArrowUp className="h-4 w-4 text-yt-green" /> : <ArrowDown className="h-4 w-4 text-yt-red" />}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: Users, label: "Subscribers", value: subscriberCount.toLocaleString(), color: "text-yt-blue", bg: "bg-yt-blue/10" },
          { icon: Eye, label: "Total views", value: totalViews.toLocaleString(), color: "text-yt-green", bg: "bg-yt-green/10" },
          { icon: ThumbsUp, label: "Total likes", value: totalLikes.toLocaleString(), color: "text-yt-red", bg: "bg-yt-red/10" },
          { icon: MessageSquare, label: "Comments", value: totalComments.toLocaleString(), color: "text-muted-foreground", bg: "bg-accent" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="pt-4 sm:pt-6 pb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Channel analytics
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-yt-blue text-xs" onClick={() => navigate("/analytics")}>See more</Button>
          </div>
          <p className="text-xs text-muted-foreground">Last 28 days</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(213, 94%, 55%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(213, 94%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="hsl(0, 0%, 40%)" fontSize={11} tickLine={false} axisLine={false} interval={3} />
              <YAxis stroke="hsl(0, 0%, 40%)" fontSize={11} tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={{ background: "hsl(0, 0%, 15.7%)", border: "1px solid hsl(0, 0%, 20%)", borderRadius: "8px", color: "hsl(0, 0%, 95%)", fontSize: 12 }} />
              <Area type="monotone" dataKey="views" stroke="hsl(213, 94%, 55%)" fill="url(#viewsGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest videos */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium text-foreground">Latest videos</CardTitle>
              <Button variant="ghost" size="sm" className="text-yt-blue text-xs" onClick={() => navigate("/content")}>See all</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {displayVideos.map((video: any) => (
              <div key={video.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer">
                <div className="w-20 sm:w-28 h-12 sm:h-16 bg-secondary rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                  {video.thumbnail_url ? (
                    <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <PlayIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-foreground truncate">{video.title}</p>
                  <div className="flex items-center gap-2 sm:gap-3 mt-1 text-[10px] sm:text-xs text-muted-foreground">
                    <span>{(video.views || 0).toLocaleString()} views</span>
                    <span>{video.likes || 0} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Latest comments */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium text-foreground">Latest comments</CardTitle>
              <Button variant="ghost" size="sm" className="text-yt-blue text-xs" onClick={() => navigate("/comments")}>See all</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {displayComments.map((comment: any) => (
              <div key={comment.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-yt-blue/20 shrink-0 flex items-center justify-center text-xs text-yt-blue font-medium">
                  {comment.author_name?.[0] || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-foreground">{comment.author_name || "Unknown"}</p>
                    <span className="text-[10px] text-muted-foreground">{new Date(comment.created_at).toLocaleDateString("en-IN")}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-2">{comment.content}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick ideas */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-foreground">💡 Content ideas for you</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "Exam preparation tips for 2nd year students",
              "Internship experience at a tech startup",
              "Day in the life of a CS student",
              "Best coding resources for beginners",
              "How to manage college + YouTube",
              "React vs Next.js - Which to learn first?",
            ].map((idea) => (
              <div key={idea} className="p-3 bg-secondary rounded-lg hover:bg-accent cursor-pointer transition-colors">
                <p className="text-sm text-foreground">{idea}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
