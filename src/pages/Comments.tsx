import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Pin, Trash2, Search, MessageSquare, Reply, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const dummyComments = [
  { id: "dc1", author_name: "Rahul Sharma", content: "Bhai amazing content! DSA wala video bahut helpful tha 🔥", created_at: "2026-03-03T10:00:00Z", is_hearted: false, is_pinned: true, likes: 24, video_title: "DSA in One Shot" },
  { id: "dc2", author_name: "Priya Singh", content: "Can you make a video on System Design for beginners? Would really help for placements!", created_at: "2026-03-02T14:30:00Z", is_hearted: true, is_pinned: false, likes: 18, video_title: "Python Full Course" },
  { id: "dc3", author_name: "Amit Kumar", content: "Your college vlogs are the best! Keep posting bro 💯", created_at: "2026-03-02T09:15:00Z", is_hearted: false, is_pinned: false, likes: 12, video_title: "College Vlog #12" },
  { id: "dc4", author_name: "Neha Gupta", content: "Which laptop do you use for coding? I'm thinking of buying one for my first year.", created_at: "2026-03-01T16:45:00Z", is_hearted: false, is_pinned: false, likes: 8, video_title: "Hostel Room Tour" },
  { id: "dc5", author_name: "Vikram Patel", content: "Subscribed! Your Python course helped me crack my interview 🙏", created_at: "2026-02-28T11:00:00Z", is_hearted: true, is_pinned: false, likes: 35, video_title: "Python Full Course" },
  { id: "dc6", author_name: "Ananya Iyer", content: "Love your editing style! What software do you use?", created_at: "2026-02-27T08:30:00Z", is_hearted: false, is_pinned: false, likes: 6, video_title: "Campus Tour 2026" },
  { id: "dc7", author_name: "Rohit Verma", content: "Bhai hostel food review bhi bana do 😂", created_at: "2026-02-26T13:20:00Z", is_hearted: false, is_pinned: false, likes: 42, video_title: "Hostel Room Tour" },
  { id: "dc8", author_name: "Shreya Mishra", content: "This helped me so much for my semester exams! Thank you Arjun bhaiya ❤️", created_at: "2026-02-25T17:00:00Z", is_hearted: true, is_pinned: false, likes: 29, video_title: "How I Got 95% in Exams" },
];

export default function Comments() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const { data: comments, isLoading } = useQuery({
    queryKey: ["all-comments", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("comments")
        .select("*, videos!inner(title, thumbnail_url, user_id)")
        .eq("videos.user_id", user!.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const toggleHeart = useMutation({
    mutationFn: async ({ id, hearted }: { id: string; hearted: boolean }) => {
      await supabase.from("comments").update({ is_hearted: !hearted }).eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-comments"] }),
  });

  const togglePin = useMutation({
    mutationFn: async ({ id, pinned }: { id: string; pinned: boolean }) => {
      await supabase.from("comments").update({ is_pinned: !pinned }).eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-comments"] }),
  });

  const deleteComment = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("comments").delete().eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-comments"] });
      toast.success("Comment deleted");
    },
  });

  const displayComments = comments?.length ? comments : dummyComments;

  const filtered = displayComments?.filter((c: any) => {
    const matchSearch = (c.content || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.author_name || "").toLowerCase().includes(search.toLowerCase());
    if (filter === "hearted") return matchSearch && c.is_hearted;
    if (filter === "pinned") return matchSearch && c.is_pinned;
    return matchSearch;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-medium text-foreground">Comments</h1>

      <div className="overflow-x-auto -mx-3 sm:-mx-0 px-3 sm:px-0">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="bg-secondary border-border flex w-max gap-1 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-accent text-xs sm:text-sm">All ({displayComments.length})</TabsTrigger>
            <TabsTrigger value="hearted" className="data-[state=active]:bg-accent text-xs sm:text-sm">❤️ Hearted</TabsTrigger>
            <TabsTrigger value="pinned" className="data-[state=active]:bg-accent text-xs sm:text-sm">📌 Pinned</TabsTrigger>
            <TabsTrigger value="held" className="data-[state=active]:bg-accent text-xs sm:text-sm">Held for review</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search comments" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-secondary border-border" />
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <p className="text-muted-foreground text-center py-12">Loading comments...</p>
        ) : !filtered?.length ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No comments found</p>
          </div>
        ) : (
          filtered.map((comment: any) => (
            <div key={comment.id} className="bg-card border border-border rounded-lg p-3 sm:p-4 flex gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yt-blue/20 shrink-0 flex items-center justify-center text-xs sm:text-sm text-yt-blue font-medium">
                {comment.author_avatar ? (
                  <img src={comment.author_avatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  comment.author_name?.[0] || "?"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-foreground">{comment.author_name || "Unknown"}</span>
                  <span className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString("en-IN")}</span>
                  {comment.is_pinned && <Badge variant="outline" className="text-[10px] bg-yt-blue/10 text-yt-blue border-yt-blue/30">Pinned</Badge>}
                  {comment.is_hearted && <Badge variant="outline" className="text-[10px] bg-yt-red/10 text-yt-red border-yt-red/30">❤️</Badge>}
                </div>
                <p className="text-xs sm:text-sm text-foreground mt-1">{comment.content}</p>
                {(comment.video_title || comment.videos?.title) && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                    on: <span className="text-yt-blue">{comment.video_title || comment.videos?.title}</span>
                  </p>
                )}
                <div className="flex items-center gap-1 mt-2 flex-wrap">
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-foreground gap-1 text-xs">
                    <ThumbsUp className="h-3.5 w-3.5" /> {comment.likes || 0}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-muted-foreground hover:text-yt-red"
                    onClick={() => comment.id?.startsWith("dc") ? null : toggleHeart.mutate({ id: comment.id, hearted: !!comment.is_hearted })}
                  >
                    <Heart className={`h-3.5 w-3.5 ${comment.is_hearted ? "fill-yt-red text-yt-red" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-muted-foreground hover:text-yt-blue"
                    onClick={() => comment.id?.startsWith("dc") ? null : togglePin.mutate({ id: comment.id, pinned: !!comment.is_pinned })}
                  >
                    <Pin className={`h-3.5 w-3.5 ${comment.is_pinned ? "text-yt-blue" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-foreground">
                    <Reply className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-muted-foreground hover:text-destructive"
                    onClick={() => comment.id?.startsWith("dc") ? null : deleteComment.mutate(comment.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
