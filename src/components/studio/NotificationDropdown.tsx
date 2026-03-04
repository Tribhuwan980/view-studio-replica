import { useState } from "react";
import { Bell, Heart, MessageSquare, Users, Video, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Notification {
  id: string;
  type: "comment" | "like" | "subscriber" | "upload";
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
}

const initialNotifications: Notification[] = [
  { id: "1", type: "comment", message: "Rahul Sharma commented on your video \"DSA in One Shot\"", time: "2 min ago", read: false },
  { id: "2", type: "like", message: "Your video \"College Vlog #12\" received 50 new likes", time: "15 min ago", read: false },
  { id: "3", type: "subscriber", message: "You gained 5 new subscribers today!", time: "1 hour ago", read: false },
  { id: "4", type: "comment", message: "Priya Singh replied to your comment on \"Python Tutorial\"", time: "2 hours ago", read: false },
  { id: "5", type: "upload", message: "Your video \"Campus Tour 2026\" is done processing", time: "3 hours ago", read: true },
  { id: "6", type: "like", message: "Amit Kumar liked your video \"Exam Tips & Tricks\"", time: "5 hours ago", read: true },
  { id: "7", type: "subscriber", message: "Neha Gupta subscribed to your channel", time: "6 hours ago", read: true },
  { id: "8", type: "comment", message: "Vikram Patel commented: \"Great content bhai! 🔥\"", time: "8 hours ago", read: true },
  { id: "9", type: "like", message: "Your video \"Hostel Life\" reached 1,000 likes!", time: "1 day ago", read: true },
  { id: "10", type: "subscriber", message: "You crossed 500 subscribers! 🎉", time: "2 days ago", read: true },
];

const iconMap = {
  comment: MessageSquare,
  like: Heart,
  subscriber: Users,
  upload: Video,
};

const colorMap = {
  comment: "text-yt-blue",
  like: "text-yt-red",
  subscriber: "text-yt-green",
  upload: "text-foreground",
};

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-yt-red text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 sm:w-96 p-0 bg-card border-border">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h3 className="text-sm font-medium text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs text-yt-blue hover:text-yt-blue/80 h-7">
              <Check className="h-3 w-3 mr-1" /> Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const Icon = iconMap[notif.type];
              return (
                <div
                  key={notif.id}
                  onClick={() => markRead(notif.id)}
                  className={`flex items-start gap-3 p-3 hover:bg-accent cursor-pointer border-b border-border/50 ${!notif.read ? "bg-accent/50" : ""}`}
                >
                  <div className={`p-1.5 rounded-full bg-secondary shrink-0 mt-0.5`}>
                    <Icon className={`h-4 w-4 ${colorMap[notif.type]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notif.read ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.time}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-yt-blue shrink-0 mt-2" />
                  )}
                </div>
              );
            })
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
