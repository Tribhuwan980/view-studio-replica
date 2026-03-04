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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  User, Bell, Shield, Globe, Key, Monitor, Smartphone,
  Mail, Eye, EyeOff, LogOut, Trash2, Download, Upload,
  ChevronRight, AlertTriangle, Link2, Users, MessageSquare,
  Video, Clock, DollarSign, FileText, Palette, Volume2,
  Languages, MapPin, Hash, ExternalLink, Copy, Check
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Notification settings
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [commentNotifs, setCommentNotifs] = useState(true);
  const [subNotifs, setSubNotifs] = useState(true);
  const [uploadNotifs, setUploadNotifs] = useState(false);
  const [mentionNotifs, setMentionNotifs] = useState(true);
  const [mobileNotifs, setMobileNotifs] = useState(true);
  const [desktopNotifs, setDesktopNotifs] = useState(true);
  const [likeNotifs, setLikeNotifs] = useState(true);
  const [milestoneNotifs, setMilestoneNotifs] = useState(true);

  // Privacy
  const [showSubCount, setShowSubCount] = useState(true);
  const [showLikedVideos, setShowLikedVideos] = useState(false);
  const [showSubs, setShowSubs] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [holdComments, setHoldComments] = useState(false);
  const [ageRestrict, setAgeRestrict] = useState(false);

  // Upload defaults
  const [defaultVisibility, setDefaultVisibility] = useState("private");
  const [defaultCategory, setDefaultCategory] = useState("education");
  const [defaultLicense, setDefaultLicense] = useState("standard");
  const [defaultComments, setDefaultComments] = useState(true);
  const [defaultTags, setDefaultTags] = useState("college, india, tech");
  const [defaultDescription, setDefaultDescription] = useState("Follow me for more content!\n\n🔔 Subscribe & Hit the Bell!\n📱 Instagram: @arjun_creates\n💼 LinkedIn: Arjun Kumar");
  const [madeForKids, setMadeForKids] = useState(false);
  const [embedAllowed, setEmbedAllowed] = useState(true);

  // Preferences
  const [language, setLanguage] = useState("en");
  const [country, setCountry] = useState("in");
  const [autoplay, setAutoplay] = useState(true);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  // Community
  const [welcomeMessage, setWelcomeMessage] = useState("Welcome to my channel! Thanks for subscribing 🙏");
  const [autoFilter, setAutoFilter] = useState(true);
  const [blockedWords, setBlockedWords] = useState("spam, scam, fake");
  const [approveLinks, setApproveLinks] = useState(true);

  // Channel
  const [channelKeywords, setChannelKeywords] = useState("college, coding, DSA, tech, vlogs, India");
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const copyChannelUrl = () => {
    const url = `youtube.com/@${profile?.channel_name?.toLowerCase().replace(/\s+/g, '') || 'channel'}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Channel URL copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-xl sm:text-2xl font-medium text-foreground">Settings</h1>

      <Tabs defaultValue="account" className="space-y-6">
        <div className="overflow-x-auto -mx-6 px-6">
          <TabsList className="bg-secondary border-border flex w-max gap-1 p-1">
            <TabsTrigger value="account" className="data-[state=active]:bg-accent gap-1.5 text-xs sm:text-sm">
              <User className="h-4 w-4 hidden sm:block" /> Account
            </TabsTrigger>
            <TabsTrigger value="channel" className="data-[state=active]:bg-accent gap-1.5 text-xs sm:text-sm">
              <Video className="h-4 w-4 hidden sm:block" /> Channel
            </TabsTrigger>
            <TabsTrigger value="upload-defaults" className="data-[state=active]:bg-accent gap-1.5 text-xs sm:text-sm">
              <Upload className="h-4 w-4 hidden sm:block" /> Upload defaults
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-accent gap-1.5 text-xs sm:text-sm">
              <Bell className="h-4 w-4 hidden sm:block" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-accent gap-1.5 text-xs sm:text-sm">
              <Shield className="h-4 w-4 hidden sm:block" /> Privacy
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-accent gap-1.5 text-xs sm:text-sm">
              <Users className="h-4 w-4 hidden sm:block" /> Community
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-accent gap-1.5 text-xs sm:text-sm">
              <Globe className="h-4 w-4 hidden sm:block" /> Preferences
            </TabsTrigger>
            <TabsTrigger value="agreements" className="data-[state=active]:bg-accent gap-1.5 text-xs sm:text-sm">
              <FileText className="h-4 w-4 hidden sm:block" /> Agreements
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-accent gap-1.5 text-xs sm:text-sm">
              <Key className="h-4 w-4 hidden sm:block" /> Advanced
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Profile</CardTitle>
              <CardDescription className="text-muted-foreground">Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 flex-wrap">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-yt-blue text-white text-xl">
                    {profile?.display_name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium">{profile?.display_name || "User"}</p>
                  <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <Badge variant="outline" className="text-xs bg-yt-blue/10 text-yt-blue border-yt-blue/30">
                      {user?.app_metadata?.provider === "google" ? "Google Account" : "Email Account"}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-yt-green/10 text-yt-green border-yt-green/30">Active</Badge>
                  </div>
                </div>
                <Button variant="outline" onClick={() => navigate("/customization")} className="border-border text-foreground text-sm">
                  Edit profile
                </Button>
              </div>

              <Separator className="bg-border" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Display name</Label>
                  <Input defaultValue={profile?.display_name || ""} className="bg-secondary border-border mt-1.5" />
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <Input value={user?.email || ""} disabled className="bg-secondary border-border mt-1.5 opacity-60" />
                </div>
              </div>

              <Button onClick={handleSave} className="bg-yt-blue hover:bg-yt-blue/90 text-white">Save changes</Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Connected accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
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
        </TabsContent>

        {/* Channel Tab */}
        <TabsContent value="channel" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Basic info</CardTitle>
              <CardDescription className="text-muted-foreground">Your channel's public information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 flex-wrap gap-2">
                <div>
                  <p className="text-sm text-foreground">Channel name</p>
                  <p className="text-xs text-muted-foreground">{profile?.channel_name || profile?.display_name || "Not set"}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-yt-blue" onClick={() => navigate("/customization")}>Edit</Button>
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-foreground">Subscribers</p>
                  <p className="text-xs text-muted-foreground">{profile?.subscriber_count || 0}</p>
                </div>
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between py-2 flex-wrap gap-2">
                <div>
                  <p className="text-sm text-foreground">Channel URL</p>
                  <p className="text-xs text-muted-foreground">youtube.com/@{profile?.channel_name?.toLowerCase().replace(/\s+/g, '') || 'channel'}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={copyChannelUrl} className="text-yt-blue text-xs">
                  {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Channel keywords</CardTitle>
              <CardDescription className="text-muted-foreground">Help viewers find your channel in search results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Keywords (comma separated)</Label>
                <Input value={channelKeywords} onChange={(e) => setChannelKeywords(e.target.value)} className="bg-secondary border-border mt-1.5" />
                <p className="text-xs text-muted-foreground mt-1">{channelKeywords.split(",").length} keywords</p>
              </div>
              <Button onClick={handleSave} className="bg-yt-blue hover:bg-yt-blue/90 text-white">Save</Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Feature eligibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { feature: "Standard features", status: "Enabled", color: "text-yt-green" },
                { feature: "Intermediate features", status: "Requires phone verification", color: "text-muted-foreground" },
                { feature: "Advanced features", status: "Requires review", color: "text-muted-foreground" },
                { feature: "Monetization", status: "Not eligible yet", color: "text-muted-foreground" },
              ].map((item) => (
                <div key={item.feature} className="flex items-center justify-between py-2">
                  <p className="text-sm text-foreground">{item.feature}</p>
                  <span className={`text-xs ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Defaults Tab */}
        <TabsContent value="upload-defaults" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Default upload settings</CardTitle>
              <CardDescription className="text-muted-foreground">These settings will be applied to all new uploads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Default visibility</Label>
                  <Select value={defaultVisibility} onValueChange={setDefaultVisibility}>
                    <SelectTrigger className="bg-secondary border-border mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="unlisted">Unlisted</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-muted-foreground">Default category</Label>
                  <Select value={defaultCategory} onValueChange={setDefaultCategory}>
                    <SelectTrigger className="bg-secondary border-border mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="science">Science & Technology</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="news">News & Politics</SelectItem>
                      <SelectItem value="howto">Howto & Style</SelectItem>
                      <SelectItem value="people">People & Blogs</SelectItem>
                      <SelectItem value="comedy">Comedy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Default license</Label>
                <Select value={defaultLicense} onValueChange={setDefaultLicense}>
                  <SelectTrigger className="bg-secondary border-border mt-1.5 max-w-sm"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="standard">Standard YouTube License</SelectItem>
                    <SelectItem value="cc">Creative Commons - Attribution</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-muted-foreground">Default tags</Label>
                <Input value={defaultTags} onChange={(e) => setDefaultTags(e.target.value)} className="bg-secondary border-border mt-1.5" placeholder="tag1, tag2, tag3" />
              </div>

              <div>
                <Label className="text-muted-foreground">Default description</Label>
                <Textarea value={defaultDescription} onChange={(e) => setDefaultDescription(e.target.value)} className="bg-secondary border-border mt-1.5 min-h-[120px]" />
              </div>

              <Separator className="bg-border" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">Allow comments</Label>
                    <p className="text-xs text-muted-foreground">Enable comments on new uploads</p>
                  </div>
                  <Switch checked={defaultComments} onCheckedChange={setDefaultComments} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">Allow embedding</Label>
                    <p className="text-xs text-muted-foreground">Let others embed your videos</p>
                  </div>
                  <Switch checked={embedAllowed} onCheckedChange={setEmbedAllowed} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">Made for kids</Label>
                    <p className="text-xs text-muted-foreground">Set content as made for children</p>
                  </div>
                  <Switch checked={madeForKids} onCheckedChange={setMadeForKids} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Button onClick={handleSave} className="bg-yt-blue hover:bg-yt-blue/90 text-white">Save upload defaults</Button>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Email notifications</CardTitle>
              <CardDescription className="text-muted-foreground">Choose what emails you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "General notifications", desc: "Product updates and announcements", state: emailNotifs, set: setEmailNotifs },
                { label: "Comments", desc: "When someone comments on your videos", state: commentNotifs, set: setCommentNotifs },
                { label: "New subscribers", desc: "When someone subscribes to your channel", state: subNotifs, set: setSubNotifs },
                { label: "Likes", desc: "When your videos receive likes", state: likeNotifs, set: setLikeNotifs },
                { label: "Upload reminders", desc: "Weekly reminders to upload content", state: uploadNotifs, set: setUploadNotifs },
                { label: "Mentions", desc: "When you're mentioned in comments", state: mentionNotifs, set: setMentionNotifs },
                { label: "Milestones", desc: "View & subscriber milestones", state: milestoneNotifs, set: setMilestoneNotifs },
              ].map((item, i) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-foreground">{item.label}</Label>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={item.state} onCheckedChange={item.set} />
                  </div>
                  {i < 6 && <Separator className="bg-border mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Push notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label className="text-foreground">Desktop notifications</Label>
                    <p className="text-xs text-muted-foreground">Show notifications on desktop</p>
                  </div>
                </div>
                <Switch checked={desktopNotifs} onCheckedChange={setDesktopNotifs} />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label className="text-foreground">Mobile notifications</Label>
                    <p className="text-xs text-muted-foreground">Show notifications on mobile</p>
                  </div>
                </div>
                <Switch checked={mobileNotifs} onCheckedChange={setMobileNotifs} />
              </div>
            </CardContent>
          </Card>
          <Button onClick={handleSave} className="bg-yt-blue hover:bg-yt-blue/90 text-white">Save notification preferences</Button>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Channel privacy</CardTitle>
              <CardDescription className="text-muted-foreground">Control what others can see</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Show subscriber count", desc: "Display subscriber count on your channel", state: showSubCount, set: setShowSubCount },
                { label: "Show liked videos", desc: "Keep all liked videos public", state: showLikedVideos, set: setShowLikedVideos },
                { label: "Show subscriptions", desc: "Allow people to see channels you subscribe to", state: showSubs, set: setShowSubs },
              ].map((item, i) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-foreground">{item.label}</Label>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={item.state} onCheckedChange={item.set} />
                  </div>
                  {i < 2 && <Separator className="bg-border mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Content restrictions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Age-restrict by default</Label>
                  <p className="text-xs text-muted-foreground">Mark uploads as age-restricted</p>
                </div>
                <Switch checked={ageRestrict} onCheckedChange={setAgeRestrict} />
              </div>
            </CardContent>
          </Card>
          <Button onClick={handleSave} className="bg-yt-blue hover:bg-yt-blue/90 text-white">Save privacy settings</Button>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Community settings</CardTitle>
              <CardDescription className="text-muted-foreground">Manage how your community interacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="text-muted-foreground">Welcome message for new subscribers</Label>
                <Textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} className="bg-secondary border-border mt-1.5 min-h-[80px]" />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Auto-filter spam comments</Label>
                  <p className="text-xs text-muted-foreground">Automatically hold potential spam for review</p>
                </div>
                <Switch checked={autoFilter} onCheckedChange={setAutoFilter} />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Hold comments with links</Label>
                  <p className="text-xs text-muted-foreground">Review comments containing links before publishing</p>
                </div>
                <Switch checked={approveLinks} onCheckedChange={setApproveLinks} />
              </div>
              <Separator className="bg-border" />
              <div>
                <Label className="text-muted-foreground">Blocked words</Label>
                <Input value={blockedWords} onChange={(e) => setBlockedWords(e.target.value)} className="bg-secondary border-border mt-1.5" placeholder="word1, word2" />
                <p className="text-xs text-muted-foreground mt-1">Comments with these words will be held for review</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Moderators</CardTitle>
              <CardDescription className="text-muted-foreground">People who can manage your comments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No moderators added yet</p>
                <Button variant="outline" size="sm" className="mt-3 border-border text-foreground">Add moderator</Button>
              </div>
            </CardContent>
          </Card>
          <Button onClick={handleSave} className="bg-yt-blue hover:bg-yt-blue/90 text-white">Save community settings</Button>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">General preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="bg-secondary border-border mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिन्दी</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="ko">한국어</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ta">தமிழ்</SelectItem>
                      <SelectItem value="te">తెలుగు</SelectItem>
                      <SelectItem value="bn">বাংলা</SelectItem>
                      <SelectItem value="mr">मराठी</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-muted-foreground">Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="bg-secondary border-border mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="in">India</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="gb">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="jp">Japan</SelectItem>
                      <SelectItem value="br">Brazil</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Playback & display</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Autoplay", desc: "Automatically play next video", state: autoplay, set: setAutoplay },
                { label: "Always show captions", desc: "Display captions when available", state: captionsOn, set: setCaptionsOn },
                { label: "Dark mode", desc: "Use dark theme (recommended)", state: darkMode, set: setDarkMode },
                { label: "Compact mode", desc: "Show more content with smaller spacing", state: compactMode, set: setCompactMode },
              ].map((item, i) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-foreground">{item.label}</Label>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={item.state} onCheckedChange={item.set} />
                  </div>
                  {i < 3 && <Separator className="bg-border mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
          <Button onClick={handleSave} className="bg-yt-blue hover:bg-yt-blue/90 text-white">Save preferences</Button>
        </TabsContent>

        {/* Agreements Tab */}
        <TabsContent value="agreements" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Terms & agreements</CardTitle>
              <CardDescription className="text-muted-foreground">Review the agreements for your channel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "YouTube Terms of Service", date: "Accepted on signup", link: "#" },
                { title: "YouTube Community Guidelines", date: "Accepted on signup", link: "#" },
                { title: "YouTube Partner Program Terms", date: "Not yet accepted", link: "#" },
                { title: "YouTube Monetization Policies", date: "Not yet accepted", link: "#" },
                { title: "AdSense Terms of Service", date: "Not yet accepted", link: "#" },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-yt-blue text-xs gap-1">
                    <ExternalLink className="h-3 w-3" /> View
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Copyright</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <Check className="h-5 w-5 text-yt-green shrink-0" />
                <div>
                  <p className="text-sm text-foreground">No copyright strikes</p>
                  <p className="text-xs text-muted-foreground">Your channel is in good standing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Data & permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3 border-border text-foreground hover:bg-accent">
                <Download className="h-4 w-4 text-muted-foreground" /> Download your data
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 border-border text-foreground hover:bg-accent">
                <Upload className="h-4 w-4 text-muted-foreground" /> Import channel data
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 border-border text-foreground hover:bg-accent">
                <FileText className="h-4 w-4 text-muted-foreground" /> View API usage
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border border-destructive/30">
            <CardHeader>
              <CardTitle className="text-base text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Danger zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-3 border-border text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
                    <LogOut className="h-4 w-4" /> Sign out from all devices
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">Sign out everywhere?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">This will sign you out from all devices and sessions.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-secondary border-border text-foreground">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={signOut} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Sign out</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-3 border-border text-destructive hover:bg-destructive/10 hover:border-destructive/30">
                    <Trash2 className="h-4 w-4" /> Delete channel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">Delete your channel?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">This will permanently delete your channel, all videos, comments, and data. This cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-secondary border-border text-foreground">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete permanently</AlertDialogAction>
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
