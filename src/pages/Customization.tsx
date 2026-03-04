import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Camera, Image, Link2, Plus, ExternalLink, Trash2, GripVertical, Video, LayoutGrid, Palette } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Customization() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  const [channelName, setChannelName] = useState("");
  const [handle, setHandle] = useState("");
  const [description, setDescription] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [contactEmail, setContactEmail] = useState("");
  const [watermark, setWatermark] = useState(false);

  // Links
  const [links, setLinks] = useState([
    { title: "Instagram", url: "https://instagram.com/arjun_creates" },
    { title: "LinkedIn", url: "https://linkedin.com/in/arjunkumar" },
    { title: "GitHub", url: "https://github.com/arjunkumar" },
  ]);

  // Featured sections
  const [sections, setSections] = useState([
    { id: "1", title: "Popular uploads", type: "popular", enabled: true },
    { id: "2", title: "Recent uploads", type: "recent", enabled: true },
    { id: "3", title: "DSA Playlist", type: "playlist", enabled: true },
    { id: "4", title: "College Vlogs", type: "playlist", enabled: false },
    { id: "5", title: "Liked videos", type: "liked", enabled: false },
  ]);

  // Trailer
  const [trailerForSubs, setTrailerForSubs] = useState("");
  const [trailerForNonSubs, setTrailerForNonSubs] = useState("");

  useEffect(() => {
    if (profile) {
      setChannelName(profile.channel_name || profile.display_name || "");
      setDescription(profile.channel_description || "");
      setHandle(profile.channel_name?.toLowerCase().replace(/\s+/g, '') || "");
    }
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      if (channelName.length > 100) throw new Error("Channel name must be 100 characters or less");
      if (description.length > 5000) throw new Error("Description must be 5000 characters or less");
      const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
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

  const addLink = () => {
    setLinks([...links, { title: "", url: "" }]);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: "title" | "url", value: string) => {
    const updated = [...links];
    updated[index][field] = value;
    setLinks(updated);
  };

  const toggleSection = (id: string) => {
    setSections(sections.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-xl sm:text-2xl font-medium text-foreground">Channel customization</h1>

      <Tabs defaultValue="branding" className="space-y-6">
        <div className="overflow-x-auto -mx-6 px-6">
          <TabsList className="bg-secondary border-border flex w-max gap-1 p-1">
            <TabsTrigger value="branding" className="data-[state=active]:bg-accent gap-1.5 text-xs sm:text-sm">
              <Palette className="h-4 w-4 hidden sm:block" /> Branding
            </TabsTrigger>
            <TabsTrigger value="basic-info" className="data-[state=active]:bg-accent gap-1.5 text-xs sm:text-sm">
              <LayoutGrid className="h-4 w-4 hidden sm:block" /> Basic info
            </TabsTrigger>
            <TabsTrigger value="layout" className="data-[state=active]:bg-accent gap-1.5 text-xs sm:text-sm">
              <Video className="h-4 w-4 hidden sm:block" /> Layout
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          {/* Banner */}
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Banner image</CardTitle>
              <CardDescription className="text-muted-foreground">This image will appear at the top of your channel. Use 2048 × 1152px for best results.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 sm:h-40 bg-secondary rounded-lg relative overflow-hidden">
                {profile?.banner_url && (
                  <img src={profile.banner_url} alt="" className="w-full h-full object-cover" />
                )}
                <label className="absolute bottom-3 right-3 cursor-pointer">
                  <div className="bg-background/80 hover:bg-background p-2 rounded-full transition-colors">
                    <Camera className="h-4 w-4 text-foreground" />
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
                </label>
              </div>
              {bannerFile && <p className="text-xs text-yt-green mt-2">New banner selected: {bannerFile.name}</p>}
            </CardContent>
          </Card>

          {/* Profile picture */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Picture</CardTitle>
              <CardDescription className="text-muted-foreground">Your profile picture appears on your channel and next to your videos. Use at least 98 × 98px.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
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
                <div className="text-sm text-muted-foreground">
                  <p>It's recommended to use a picture that's at least 98 x 98 pixels and 4MB or less.</p>
                  {avatarFile && <p className="text-yt-green mt-1">New picture selected: {avatarFile.name}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video watermark */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Video watermark</CardTitle>
              <CardDescription className="text-muted-foreground">Add a branding watermark to your videos. 150 × 150px recommended.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Enable watermark</Label>
                  <p className="text-xs text-muted-foreground">Shows your channel logo on all videos</p>
                </div>
                <Switch checked={watermark} onCheckedChange={setWatermark} />
              </div>
              {watermark && (
                <div className="mt-4">
                  <Input type="file" accept="image/png" className="bg-secondary border-border" />
                  <p className="text-xs text-muted-foreground mt-1">PNG only, 150 × 150px recommended</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-yt-blue hover:bg-yt-blue/90 text-white">
            {saveMutation.isPending ? "Saving..." : "Publish"}
          </Button>
        </TabsContent>

        {/* Basic Info Tab */}
        <TabsContent value="basic-info" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Channel details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Channel name</Label>
                <Input value={channelName} onChange={(e) => setChannelName(e.target.value)} className="bg-secondary border-border mt-1" maxLength={100} />
                <p className="text-xs text-muted-foreground mt-1">{channelName.length}/100</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Handle</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                  <Input value={handle} onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} className="bg-secondary border-border pl-7" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">youtube.com/@{handle || 'yourchannel'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-secondary border-border mt-1 min-h-[120px]" maxLength={5000} />
                <p className="text-xs text-muted-foreground mt-1">{description.length}/5000</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Contact email</Label>
                <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="business@example.com" className="bg-secondary border-border mt-1" />
                <p className="text-xs text-muted-foreground mt-1">This email will be visible on your About page</p>
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base text-foreground">Links</CardTitle>
                  <CardDescription className="text-muted-foreground">Add links to your channel banner</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addLink} className="border-border text-foreground gap-1">
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {links.map((link, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      value={link.title}
                      onChange={(e) => updateLink(i, "title", e.target.value)}
                      placeholder="Link title"
                      className="bg-secondary border-border"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => updateLink(i, "url", e.target.value)}
                      placeholder="https://"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeLink(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {links.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No links added. Click "Add" to add links.</p>
              )}
            </CardContent>
          </Card>

          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-yt-blue hover:bg-yt-blue/90 text-white">
            {saveMutation.isPending ? "Saving..." : "Publish"}
          </Button>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-6">
          {/* Channel trailer */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Channel trailer</CardTitle>
              <CardDescription className="text-muted-foreground">Set a video to feature at the top of your channel page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">For people who haven't subscribed</Label>
                <Input value={trailerForNonSubs} onChange={(e) => setTrailerForNonSubs(e.target.value)} placeholder="Paste video URL or select from your videos" className="bg-secondary border-border mt-1" />
              </div>
              <div>
                <Label className="text-muted-foreground">For returning subscribers</Label>
                <Input value={trailerForSubs} onChange={(e) => setTrailerForSubs(e.target.value)} placeholder="Paste video URL or select from your videos" className="bg-secondary border-border mt-1" />
              </div>
            </CardContent>
          </Card>

          {/* Featured sections */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Featured sections</CardTitle>
              <CardDescription className="text-muted-foreground">Choose which sections appear on your channel home page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {sections.map((section) => (
                <div key={section.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    <div>
                      <p className="text-sm text-foreground">{section.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{section.type}</p>
                    </div>
                  </div>
                  <Switch checked={section.enabled} onCheckedChange={() => toggleSection(section.id)} />
                </div>
              ))}
              <Button variant="outline" size="sm" className="mt-2 border-border text-foreground gap-1">
                <Plus className="h-3 w-3" /> Add section
              </Button>
            </CardContent>
          </Card>

          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-yt-blue hover:bg-yt-blue/90 text-white">
            {saveMutation.isPending ? "Saving..." : "Publish"}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
