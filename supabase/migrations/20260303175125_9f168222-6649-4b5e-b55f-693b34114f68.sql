
-- 1. Make videos and subtitles buckets private
UPDATE storage.buckets SET public = false WHERE id IN ('videos', 'subtitles');

-- 2. Drop existing overly permissive storage SELECT policies
DROP POLICY IF EXISTS "Public video access" ON storage.objects;
DROP POLICY IF EXISTS "Public thumbnail access" ON storage.objects;
DROP POLICY IF EXISTS "Public subtitle access" ON storage.objects;
DROP POLICY IF EXISTS "Public channel asset access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view subtitles" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view channel assets" ON storage.objects;

-- 3. Recreate storage SELECT policies with proper access control
-- Videos: only owner can access
CREATE POLICY "Owners can view own videos" ON storage.objects FOR SELECT
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Thumbnails: public (needed for video listings)
CREATE POLICY "Thumbnails are public" ON storage.objects FOR SELECT
USING (bucket_id = 'thumbnails');

-- Subtitles: only owner can access
CREATE POLICY "Owners can view own subtitles" ON storage.objects FOR SELECT
USING (bucket_id = 'subtitles' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Channel assets: public (profile pics, banners)
CREATE POLICY "Channel assets are public" ON storage.objects FOR SELECT
USING (bucket_id = 'channel-assets');

-- 4. Add input length constraints via triggers (not CHECK since they're more flexible)
CREATE OR REPLACE FUNCTION public.validate_video_input()
RETURNS TRIGGER AS $$
BEGIN
  IF length(NEW.title) > 200 THEN
    RAISE EXCEPTION 'Video title must be 200 characters or less';
  END IF;
  IF NEW.description IS NOT NULL AND length(NEW.description) > 10000 THEN
    RAISE EXCEPTION 'Video description must be 10000 characters or less';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_video_before_insert_update
BEFORE INSERT OR UPDATE ON public.videos
FOR EACH ROW EXECUTE FUNCTION public.validate_video_input();

CREATE OR REPLACE FUNCTION public.validate_comment_input()
RETURNS TRIGGER AS $$
BEGIN
  IF length(NEW.content) > 5000 THEN
    RAISE EXCEPTION 'Comment must be 5000 characters or less';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_comment_before_insert_update
BEFORE INSERT OR UPDATE ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.validate_comment_input();

CREATE OR REPLACE FUNCTION public.validate_profile_input()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.channel_name IS NOT NULL AND length(NEW.channel_name) > 100 THEN
    RAISE EXCEPTION 'Channel name must be 100 characters or less';
  END IF;
  IF NEW.channel_description IS NOT NULL AND length(NEW.channel_description) > 5000 THEN
    RAISE EXCEPTION 'Channel description must be 5000 characters or less';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_profile_before_insert_update
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.validate_profile_input();
