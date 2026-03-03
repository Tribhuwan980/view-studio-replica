import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  User, Bell, Shield, Globe, Palette, Monitor, Smartphone,
  Mail, Key, Eye, EyeOff, LogOut, Trash2, Download, Upload,
  ChevronRight, Info, AlertTriangle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const { user, profile, signOut } = useAuth();

  // Notification settings
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [commentNotifs, setCommentNotifs] = useState(true);
  const [subNotifs, setSubNotifs] = useState(true);
  const [uploadNotifs, setUploadNotifs] = useState(false);
  const [mentionNotifs, setMentionNotifs] = useState(true);

  // Privacy settings
  const [showSubCount, setShowSubCount] = useState(true);
  const [showLikedVideos, setShowLikedVideos] = useState(false);
  const [showSubs, setShowSubs] = useState(true);

  // Preferences
  const [language, setLanguage] = useState("en");
  const [country, setCountry] = useState("us");
  const [autoplay, setAutoplay] = useState(true);
  const [defaultVisibility, setDefaultVisibility] = useState("private");

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-medium text-foreground">Settings</h1>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-secondary border-border flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="account" className="data-[state=active]:bg-accent gap-2">
            <User className="h-4 w-4" /> Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-accent gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-accent gap-2">
            <Shield className="h-4 w-4" /> Privacy
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-accent gap-2">
            <Globe className="h-4 w-4" /> Preferences
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-accent gap-2">
            <Key className="h-4 w-4" /> Advanced
          </TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Profile</CardTitle>
              <CardDescription className="text-muted-foreground">Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-yt-blue text-white text-xl">
                    {profile?.display_name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-foreground font-medium">{profile?.display_name || "User"}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <Badge variant="outline" className="mt-1 text-xs bg-yt-blue/10 text-yt-blue border-yt-blue/30">
                    Google Account
                  </Badge>
                </div>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Display name</Label>
                  <Input defaultValue={profile?.display_name || ""} className="bg-secondary border-border mt-1.5" />
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <Input value={user?.email || ""} disabled className="bg-secondary border-border mt-1.5 opacity-60" />
                  <p className="text-xs text-muted-foreground mt-1">Managed by your Google account</p>
                </div>
              </div>

              <Button onClick={handleSave} className="bg-yt-blue hover:bg-yt-blue/90 text-white">
                Save changes
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Channel info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-foreground">Channel name</p>
                  <p className="text-xs text-muted-foreground">{profile?.channel_name || profile?.display_name || "Not set"}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-foreground">Subscribers</p>
                  <p className="text-xs text-muted-foreground">{profile?.subscriber_count || 0}</p>
                </div>
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-foreground">Channel URL</p>
                  <p className="text-xs text-muted-foreground">youtube.com/@{profile?.channel_name?.toLowerCase().replace(/\s+/g, '') || 'channel'}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-yt-blue text-xs">Copy</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Email notifications</CardTitle>
              <CardDescription className="text-muted-foreground">Choose what emails you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">General notifications</Label>
                  <p className="text-xs text-muted-foreground">Product updates and announcements</p>
                </div>
                <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Comments</Label>
                  <p className="text-xs text-muted-foreground">When someone comments on your videos</p>
                </div>
                <Switch checked={commentNotifs} onCheckedChange={setCommentNotifs} />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">New subscribers</Label>
                  <p className="text-xs text-muted-foreground">When someone subscribes to your channel</p>
                </div>
                <Switch checked={subNotifs} onCheckedChange={setSubNotifs} />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Upload reminders</Label>
                  <p className="text-xs text-muted-foreground">Weekly reminders to upload content</p>
                </div>
                <Switch checked={uploadNotifs} onCheckedChange={setUploadNotifs} />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Mentions</Label>
                  <p className="text-xs text-muted-foreground">When you're mentioned in comments</p>
                </div>
                <Switch checked={mentionNotifs} onCheckedChange={setMentionNotifs} />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="bg-yt-blue hover:bg-yt-blue/90 text-white">
            Save notification preferences
          </Button>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Channel privacy</CardTitle>
              <CardDescription className="text-muted-foreground">Control what others see on your channel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Show subscriber count</Label>
                  <p className="text-xs text-muted-foreground">Display subscriber count on your channel</p>
                </div>
                <Switch checked={showSubCount} onCheckedChange={setShowSubCount} />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Show liked videos</Label>
                  <p className="text-xs text-muted-foreground">Keep all liked videos public</p>
                </div>
                <Switch checked={showLikedVideos} onCheckedChange={setShowLikedVideos} />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Show subscriptions</Label>
                  <p className="text-xs text-muted-foreground">Allow people to see channels you subscribe to</p>
                </div>
                <Switch checked={showSubs} onCheckedChange={setShowSubs} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Default upload settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Default visibility</Label>
                <Select value={defaultVisibility} onValueChange={setDefaultVisibility}>
                  <SelectTrigger className="bg-secondary border-border mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="unlisted">Unlisted</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Allow comments by default</Label>
                  <p className="text-xs text-muted-foreground">New uploads will have comments enabled</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="bg-yt-blue hover:bg-yt-blue/90 text-white">
            Save privacy settings
          </Button>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">General preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-secondary border-border mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                    <SelectItem value="ko">한국어</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="hi">हिन्दी</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-muted-foreground">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="bg-secondary border-border mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="gb">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="in">India</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="br">Brazil</SelectItem>
                    <SelectItem value="jp">Japan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Playback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Autoplay</Label>
                  <p className="text-xs text-muted-foreground">Automatically play next video in queue</p>
                </div>
                <Switch checked={autoplay} onCheckedChange={setAutoplay} />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Captions always on</Label>
                  <p className="text-xs text-muted-foreground">Always show captions when available</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="bg-yt-blue hover:bg-yt-blue/90 text-white">
            Save preferences
          </Button>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Data & permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start gap-3 border-border text-foreground hover:bg-accent">
                <Download className="h-4 w-4 text-muted-foreground" />
                Download your data
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 border-border text-foreground hover:bg-accent">
                <Upload className="h-4 w-4 text-muted-foreground" />
                Import channel data
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Connected accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="hsl(213, 94%, 55%)" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="hsl(145, 63%, 49%)" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="hsl(45, 93%, 47%)" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="hsl(0, 100%, 50%)" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">Google</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs bg-yt-green/10 text-yt-green border-yt-green/30">Connected</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border border-destructive/30">
            <CardHeader>
              <CardTitle className="text-base text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Danger zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-3 border-border text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
                    <LogOut className="h-4 w-4" />
                    Sign out from all devices
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">Sign out everywhere?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      This will sign you out from all devices and sessions. You'll need to sign in again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-secondary border-border text-foreground">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={signOut} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Sign out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-3 border-border text-destructive hover:bg-destructive/10 hover:border-destructive/30">
                    <Trash2 className="h-4 w-4" />
                    Delete channel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">Delete your channel?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      This will permanently delete your channel, all videos, comments, and data. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-secondary border-border text-foreground">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete permanently
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
