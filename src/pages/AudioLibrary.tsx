import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Play, Pause, Music, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockTracks = [
  { id: 1, title: "Chill Vibes", artist: "Audio Library", genre: "Lo-fi", mood: "Calm", duration: "3:24" },
  { id: 2, title: "Epic Journey", artist: "Free Music", genre: "Cinematic", mood: "Dramatic", duration: "4:12" },
  { id: 3, title: "Happy Day", artist: "Sound Effects", genre: "Pop", mood: "Happy", duration: "2:58" },
  { id: 4, title: "Dark Ambient", artist: "Ambient Lab", genre: "Ambient", mood: "Dark", duration: "5:01" },
  { id: 5, title: "Upbeat Energy", artist: "Beat Factory", genre: "Electronic", mood: "Energetic", duration: "3:45" },
  { id: 6, title: "Acoustic Morning", artist: "Guitar World", genre: "Acoustic", mood: "Calm", duration: "3:10" },
  { id: 7, title: "Retro Funk", artist: "Funk Masters", genre: "Funk", mood: "Happy", duration: "4:30" },
  { id: 8, title: "Piano Dreams", artist: "Classical Hub", genre: "Classical", mood: "Calm", duration: "6:15" },
];

const genres = ["All", "Lo-fi", "Cinematic", "Pop", "Ambient", "Electronic", "Acoustic", "Funk", "Classical"];

export default function AudioLibrary() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [playing, setPlaying] = useState<number | null>(null);

  const filtered = mockTracks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.artist.toLowerCase().includes(search.toLowerCase());
    const matchGenre = genre === "All" || t.genre === genre;
    return matchSearch && matchGenre;
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-medium text-foreground">Audio library</h1>

      <Tabs defaultValue="music">
        <TabsList className="bg-secondary border-border">
          <TabsTrigger value="music" className="data-[state=active]:bg-accent">Free music</TabsTrigger>
          <TabsTrigger value="sfx" className="data-[state=active]:bg-accent">Sound effects</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search music" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-secondary border-border" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {genres.map((g) => (
            <Button
              key={g}
              variant="ghost"
              size="sm"
              onClick={() => setGenre(g)}
              className={`text-xs h-8 ${genre === g ? "bg-accent text-foreground" : "text-muted-foreground"}`}
            >
              {g}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        {filtered.map((track) => (
          <div key={track.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent group">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={() => setPlaying(playing === track.id ? null : track.id)}
            >
              {playing === track.id ? (
                <Pause className="h-4 w-4 text-yt-blue" />
              ) : (
                <Play className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              )}
            </Button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{track.title}</p>
              <p className="text-xs text-muted-foreground">{track.artist}</p>
            </div>
            <Badge variant="outline" className="bg-secondary text-muted-foreground border-border text-xs">{track.genre}</Badge>
            <Badge variant="outline" className="bg-secondary text-muted-foreground border-border text-xs">{track.mood}</Badge>
            <span className="text-xs text-muted-foreground w-10 text-right">{track.duration}</span>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-yt-blue opacity-0 group-hover:opacity-100">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
