import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Customization() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  useEffect(() => {
    if (profile) {
      setChannelName(profile.channel_name || profile.display_name || "");
      setDescription(profile.channel_description || "");
    }
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      if (channelName.length > 100) throw new Error("Channel name must be 100 characters or less");
      if (description.length > 5000) throw new Error("Description must be 5000 characters or less");
      const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
      if (avatarFile && avatarFile.size > MAX_IMAGE_SIZE) throw new Error("Avatar must be under 5MB");
      if (bannerFile && bannerFile.size > MAX_IMAGE_SIZE) throw new Error("Banner must be under 5MB");

      const updates: any = {
        channel_name: channelName.slice(0, 100),
        channel_description: description.slice(0, 5000),
      };

      if (avatarFile) {
        const path = `${user.id}/avatar-${Date.now()}`;
        await supabase.storage.from("channel-assets").upload(path, avatarFile);
        const { data } = supabase.storage.from("channel-assets").getPublicUrl(path);
        updates.avatar_url = data.publicUrl;
      }

      if (bannerFile) {
        const path = `${user.id}/banner-${Date.now()}`;
        await supabase.storage.from("channel-assets").upload(path, bannerFile);
        const { data } = supabase.storage.from("channel-assets").getPublicUrl(path);
        updates.banner_url = data.publicUrl;
      }

      const { error } = await supabase.from("profiles").update(updates).eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Channel updated!");
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-medium text-foreground">Channel customization</h1>

      {/* Banner preview */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="h-40 bg-secondary relative">
          {profile?.banner_url && (
            <img src={profile.banner_url} alt="" className="w-full h-full object-cover" />
          )}
          <label className="absolute bottom-3 right-3 cursor-pointer">
            <div className="bg-background/80 hover:bg-background p-2 rounded-full">
              <Camera className="h-4 w-4 text-foreground" />
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
          </label>
        </div>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="bg-yt-blue text-white text-2xl">
                  {profile?.display_name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-1 -right-1 cursor-pointer">
                <div className="bg-yt-blue p-1.5 rounded-full">
                  <Camera className="h-3 w-3 text-white" />
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
              </label>
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">{channelName || "Your Channel"}</p>
              <p className="text-sm text-muted-foreground">{profile?.subscriber_count || 0} subscribers</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Basic info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Channel name</label>
            <Input value={channelName} onChange={(e) => setChannelName(e.target.value)} className="bg-secondary border-border mt-1" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-secondary border-border mt-1 min-h-[120px]" />
          </div>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-yt-blue hover:bg-yt-blue/90 text-white">
            {saveMutation.isPending ? "Saving..." : "Publish"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
