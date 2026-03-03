import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Search, Eye, ThumbsUp, MessageSquare, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Database } from "@/integrations/supabase/types";

type VideoStatus = Database["public"]["Enums"]["video_status"];

export default function Content() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showUpload, setShowUpload] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Upload form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<VideoStatus>("private");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const { data: videos, isLoading } = useQuery({
    queryKey: ["videos", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!videoFile || !user) throw new Error("Missing file or user");

      // Client-side validation
      const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
      const MAX_THUMB_SIZE = 5 * 1024 * 1024; // 5MB
      if (videoFile.size > MAX_VIDEO_SIZE) throw new Error("Video must be under 500MB");
      if (thumbnailFile && thumbnailFile.size > MAX_THUMB_SIZE) throw new Error("Thumbnail must be under 5MB");
      if (title.length > 200) throw new Error("Title must be 200 characters or less");
      if (description.length > 10000) throw new Error("Description must be 10,000 characters or less");

      setUploading(true);
      setUploadProgress(10);

      // Upload video
      const videoPath = `${user.id}/${Date.now()}-${videoFile.name}`;
      const { error: videoError } = await supabase.storage
        .from("videos")
        .upload(videoPath, videoFile);
      if (videoError) throw videoError;
      setUploadProgress(50);

      // Videos bucket is private, use signed URL
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from("videos")
        .createSignedUrl(videoPath, 60 * 60 * 24 * 365); // 1 year
      if (signedUrlError) throw signedUrlError;

      // Upload thumbnail if provided (thumbnails bucket is public)
      let thumbnailUrl = null;
      if (thumbnailFile) {
        const thumbPath = `${user.id}/${Date.now()}-${thumbnailFile.name}`;
        const { error: thumbError } = await supabase.storage
          .from("thumbnails")
          .upload(thumbPath, thumbnailFile);
        if (thumbError) throw thumbError;
        const { data: thumbUrlData } = supabase.storage.from("thumbnails").getPublicUrl(thumbPath);
        thumbnailUrl = thumbUrlData.publicUrl;
      }
      setUploadProgress(75);

      // Insert video record
      const { error: insertError } = await supabase.from("videos").insert({
        user_id: user.id,
        title: (title || videoFile.name).slice(0, 200),
        description: description.slice(0, 10000),
        video_url: signedUrlData.signedUrl,
        thumbnail_url: thumbnailUrl,
        status: visibility,
        visibility,
      });
      if (insertError) throw insertError;
      setUploadProgress(100);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Video uploaded successfully!");
      resetUploadForm();
    },
    onError: (error) => {
      toast.error("Upload failed: " + error.message);
    },
    onSettled: () => {
      setUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (videoId: string) => {
      const { error } = await supabase.from("videos").delete().eq("id", videoId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Video deleted");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: { id: string; title: string; description: string; status: VideoStatus }) => {
      const { error } = await supabase
        .from("videos")
        .update({ title: updates.title, description: updates.description, status: updates.status })
        .eq("id", updates.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Video updated");
      setShowEdit(false);
    },
  });

  const resetUploadForm = () => {
    setShowUpload(false);
    setTitle("");
    setDescription("");
    setVisibility("private");
    setVideoFile(null);
    setThumbnailFile(null);
    setUploadProgress(0);
  };

  const filteredVideos = videos?.filter((v) =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColor = (status: string) => {
    switch (status) {
      case "public": return "bg-yt-green/20 text-yt-green border-yt-green/30";
      case "unlisted": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "private": return "bg-muted text-muted-foreground border-border";
      case "draft": return "bg-muted text-muted-foreground border-border";
      default: return "";
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("video/")) {
      setVideoFile(file);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  }, [title]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-foreground">Channel content</h1>
        <Button onClick={() => setShowUpload(true)} className="bg-yt-blue hover:bg-yt-blue/90 text-white">
          <Upload className="h-4 w-4 mr-2" /> Upload videos
        </Button>
      </div>

      <Tabs defaultValue="videos">
        <TabsList className="bg-secondary border-border">
          <TabsTrigger value="videos" className="data-[state=active]:bg-accent">Videos</TabsTrigger>
          <TabsTrigger value="shorts" className="data-[state=active]:bg-accent">Shorts</TabsTrigger>
          <TabsTrigger value="live" className="data-[state=active]:bg-accent">Live</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search videos"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-secondary border-border"
        />
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Video</TableHead>
              <TableHead className="text-muted-foreground">Visibility</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground text-right">Views</TableHead>
              <TableHead className="text-muted-foreground text-right">Comments</TableHead>
              <TableHead className="text-muted-foreground text-right">Likes</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : !filteredVideos?.length ? (
              <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No videos found. Upload your first video!</TableCell></TableRow>
            ) : (
              filteredVideos.map((video) => (
                <TableRow key={video.id} className="border-border hover:bg-accent/50 cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-28 h-16 bg-secondary rounded overflow-hidden shrink-0">
                        {video.thumbnail_url ? (
                          <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <PlayIcon className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{video.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{video.description || "No description"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColor(video.status)}>{video.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(video.upload_date)}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{video.views || 0}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{video.comments_count || 0}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{video.likes || 0}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem onClick={() => { setEditingVideo(video); setShowEdit(true); }}>
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate(video.id)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={(open) => !uploading && (open ? setShowUpload(true) : resetUploadForm())}>
        <DialogContent className="bg-card border-border max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Upload video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!videoFile ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-yt-blue/50 transition-colors"
                onClick={() => document.getElementById("video-input")?.click()}
              >
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Drag and drop video files to upload</p>
                <p className="text-xs text-muted-foreground mt-1">or click to select</p>
                <input
                  id="video-input"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { setVideoFile(file); if (!title) setTitle(file.name.replace(/\.[^/.]+$/, "")); }
                  }}
                />
              </div>
            ) : (
              <>
                <div className="bg-secondary rounded-lg p-3 flex items-center gap-3">
                  <PlayIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground truncate">{videoFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  {!uploading && (
                    <Button variant="ghost" size="sm" onClick={() => setVideoFile(null)}>Change</Button>
                  )}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-secondary border-border mt-1" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Description</label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-secondary border-border mt-1 min-h-[80px]" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Visibility</label>
                  <Select value={visibility} onValueChange={(v) => setVisibility(v as VideoStatus)}>
                    <SelectTrigger className="bg-secondary border-border mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="unlisted">Unlisted</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Thumbnail</label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="bg-secondary border-border mt-1"
                    onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  />
                </div>
                {uploading && <Progress value={uploadProgress} className="h-2" />}
                <Button
                  onClick={() => uploadMutation.mutate()}
                  disabled={uploading}
                  className="w-full bg-yt-blue hover:bg-yt-blue/90 text-white"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit video</DialogTitle>
          </DialogHeader>
          {editingVideo && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Title</label>
                <Input
                  value={editingVideo.title}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  className="bg-secondary border-border mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Description</label>
                <Textarea
                  value={editingVideo.description || ""}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                  className="bg-secondary border-border mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Visibility</label>
                <Select
                  value={editingVideo.status}
                  onValueChange={(v) => setEditingVideo({ ...editingVideo, status: v })}
                >
                  <SelectTrigger className="bg-secondary border-border mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="unlisted">Unlisted</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => updateMutation.mutate({
                  id: editingVideo.id,
                  title: editingVideo.title,
                  description: editingVideo.description,
                  status: editingVideo.status,
                })}
                className="w-full bg-yt-blue hover:bg-yt-blue/90 text-white"
              >
                Save changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
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
