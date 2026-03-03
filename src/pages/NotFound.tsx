import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="bg-yt-red rounded-xl p-3 inline-block">
          <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white">
            <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
          </svg>
        </div>
        <h1 className="text-5xl font-bold text-foreground">404</h1>
        <p className="text-muted-foreground text-lg">This page isn't available</p>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="bg-yt-blue hover:bg-yt-blue/90 text-white mt-2">
          <a href="/">Go to Dashboard</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
