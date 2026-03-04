import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      toast.error("Invalid or expired reset link");
      navigate("/login");
    }
  }, [navigate]);

  const handleReset = async () => {
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirm) return toast.error("Passwords don't match");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated!");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto space-y-6">
        <div className="flex items-center justify-center gap-2">
          <div className="bg-yt-red rounded-xl p-2">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
              <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
            </svg>
          </div>
          <h1 className="text-2xl font-medium text-foreground">YouTube Studio</h1>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-medium text-foreground">Set new password</h2>
          <div className="space-y-2">
            <Label className="text-muted-foreground">New password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 bg-secondary border-border" placeholder="Min 6 characters" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Confirm password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="pl-9 bg-secondary border-border" placeholder="••••••••" />
            </div>
          </div>
          <Button onClick={handleReset} disabled={loading} className="w-full bg-yt-blue hover:bg-yt-blue/90 text-white">
            {loading ? "Updating..." : "Update password"}
          </Button>
        </div>
      </div>
    </div>
  );
}
