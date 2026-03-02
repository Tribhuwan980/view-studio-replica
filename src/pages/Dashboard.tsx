import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Eye, ThumbsUp, MessageSquare, Users, TrendingUp, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockChartData = Array.from({ length: 28 }, (_, i) => ({
  day: `Day ${i + 1}`,
  views: Math.floor(Math.random() * 500 + 100),
  watchTime: Math.floor(Math.random() * 200 + 50),
}));

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

  const totalViews = videos?.reduce((sum, v) => sum + (v.views || 0), 0) || 0;
  const totalLikes = videos?.reduce((sum, v) => sum + (v.likes || 0), 0) || 0;
  const totalComments = videos?.reduce((sum, v) => sum + (v.comments_count || 0), 0) || 0;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Channel dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {profile?.channel_name || profile?.display_name || "Your Channel"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/content")}
            className="bg-yt-blue hover:bg-yt-blue/90 text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload videos
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yt-blue/10">
                <Users className="h-5 w-5 text-yt-blue" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{profile?.subscriber_count || 0}</p>
                <p className="text-xs text-muted-foreground">Current subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yt-green/10">
                <Eye className="h-5 w-5 text-yt-green" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{totalViews}</p>
                <p className="text-xs text-muted-foreground">Total views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yt-red/10">
                <ThumbsUp className="h-5 w-5 text-yt-red" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{totalLikes}</p>
                <p className="text-xs text-muted-foreground">Total likes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{totalComments}</p>
                <p className="text-xs text-muted-foreground">Total comments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Channel analytics
          </CardTitle>
          <p className="text-xs text-muted-foreground">Last 28 days</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(213, 94%, 55%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(213, 94%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="hsl(0, 0%, 40%)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(0, 0%, 40%)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(0, 0%, 15.7%)",
                  border: "1px solid hsl(0, 0%, 20%)",
                  borderRadius: "8px",
                  color: "hsl(0, 0%, 95%)",
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="views" stroke="hsl(213, 94%, 55%)" fill="url(#viewsGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest videos */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium text-foreground">Latest videos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(!videos || videos.length === 0) ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No videos yet. Upload your first video!</p>
            ) : (
              videos.map((video) => (
                <div key={video.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer">
                  <div className="w-28 h-16 bg-secondary rounded-lg overflow-hidden shrink-0">
                    {video.thumbnail_url ? (
                      <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PlayIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{video.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{video.views || 0} views</span>
                      <span>{video.likes || 0} likes</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Latest comments */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium text-foreground">Latest comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(!comments || comments.length === 0) ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent">
                  <div className="w-8 h-8 rounded-full bg-secondary shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                    {comment.author_name?.[0] || "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">{comment.author_name || "Unknown"}</p>
                    <p className="text-sm text-foreground mt-0.5 line-clamp-2">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
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
