import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Subtitles, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const languages = ["English", "Spanish", "French", "German", "Japanese", "Korean", "Hindi", "Portuguese", "Arabic", "Chinese"];

export default function SubtitlesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [selectedLang, setSelectedLang] = useState("English");
  const [subtitleFile, setSubtitleFile] = useState<File | null>(null);

  const { data: videos } = useQuery({
    queryKey: ["subtitle-videos", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("videos").select("id, title").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: subtitles, isLoading } = useQuery({
    queryKey: ["subtitles", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("subtitles")
        .select("*, videos(title)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const addSubtitle = useMutation({
    mutationFn: async () => {
      if (!selectedVideo || !user) throw new Error("Missing data");
      let fileUrl = null;
      if (subtitleFile) {
        const path = `${user.id}/${Date.now()}-${subtitleFile.name}`;
        await supabase.storage.from("subtitles").upload(path, subtitleFile);
        const { data } = supabase.storage.from("subtitles").getPublicUrl(path);
        fileUrl = data.publicUrl;
      }
      const { error } = await supabase.from("subtitles").insert({
        video_id: selectedVideo,
        user_id: user.id,
        language: selectedLang,
        file_url: fileUrl,
        status: fileUrl ? "published" : "draft",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subtitles"] });
      toast.success("Subtitle added");
      setShowAdd(false);
      setSubtitleFile(null);
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-foreground">Subtitles</h1>
        <Button onClick={() => setShowAdd(true)} className="bg-yt-blue hover:bg-yt-blue/90 text-white">
          <Plus className="h-4 w-4 mr-2" /> Add subtitles
        </Button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Video</TableHead>
              <TableHead className="text-muted-foreground">Language</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : !subtitles?.length ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <Subtitles className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No subtitles yet</p>
                </TableCell>
              </TableRow>
            ) : (
              subtitles.map((sub) => (
                <TableRow key={sub.id} className="border-border hover:bg-accent/50">
                  <TableCell className="text-sm text-foreground">{(sub as any).videos?.title || "—"}</TableCell>
                  <TableCell className="text-sm text-foreground">{sub.language}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={sub.status === "published" ? "bg-yt-green/20 text-yt-green border-yt-green/30" : "bg-muted text-muted-foreground"}>
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader><DialogTitle className="text-foreground">Add subtitles</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Video</label>
              <Select value={selectedVideo} onValueChange={setSelectedVideo}>
                <SelectTrigger className="bg-secondary border-border mt-1"><SelectValue placeholder="Select video" /></SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {videos?.map((v) => <SelectItem key={v.id} value={v.id}>{v.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Language</label>
              <Select value={selectedLang} onValueChange={setSelectedLang}>
                <SelectTrigger className="bg-secondary border-border mt-1"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {languages.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Subtitle file (SRT/VTT)</label>
              <Input type="file" accept=".srt,.vtt" className="bg-secondary border-border mt-1" onChange={(e) => setSubtitleFile(e.target.files?.[0] || null)} />
            </div>
            <Button onClick={() => addSubtitle.mutate()} disabled={!selectedVideo} className="w-full bg-yt-blue hover:bg-yt-blue/90 text-white">
              Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
