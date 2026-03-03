import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Pin, Trash2, Search, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Comments() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

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

  const filtered = comments?.filter((c) =>
    c.content.toLowerCase().includes(search.toLowerCase()) ||
    c.author_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-medium text-foreground">Comments</h1>

      <Tabs defaultValue="all">
        <TabsList className="bg-secondary border-border">
          <TabsTrigger value="all" className="data-[state=active]:bg-accent">All</TabsTrigger>
          <TabsTrigger value="held" className="data-[state=active]:bg-accent">Held for review</TabsTrigger>
        </TabsList>
      </Tabs>

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
            <p className="text-muted-foreground">No comments yet</p>
          </div>
        ) : (
          filtered.map((comment) => (
            <div key={comment.id} className="bg-card border border-border rounded-lg p-4 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-secondary shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                {comment.author_avatar ? (
                  <img src={comment.author_avatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  comment.author_name?.[0] || "?"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{comment.author_name || "Unknown"}</span>
                  <span className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</span>
                  {comment.is_pinned && <Pin className="h-3 w-3 text-yt-blue" />}
                </div>
                <p className="text-sm text-foreground mt-1">{comment.content}</p>
                {(comment as any).videos && (
                  <p className="text-xs text-muted-foreground mt-1">on: {(comment as any).videos.title}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-muted-foreground hover:text-yt-red"
                    onClick={() => toggleHeart.mutate({ id: comment.id, hearted: !!comment.is_hearted })}
                  >
                    <Heart className={`h-4 w-4 ${comment.is_hearted ? "fill-yt-red text-yt-red" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-muted-foreground hover:text-yt-blue"
                    onClick={() => togglePin.mutate({ id: comment.id, pinned: !!comment.is_pinned })}
                  >
                    <Pin className={`h-4 w-4 ${comment.is_pinned ? "text-yt-blue" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteComment.mutate(comment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
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
