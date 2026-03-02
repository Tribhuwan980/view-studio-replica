

## YouTube Studio Clone — Implementation Plan

### Overview
A full-featured YouTube Studio clone with the dark UI aesthetic of the real YouTube Studio, Google OAuth authentication, real video uploads via Supabase Storage, and all major sections.

---

### Phase 1: Backend & Auth Setup
- **Enable Lovable Cloud** with database, auth, and storage
- **Google OAuth** sign-in (matching YouTube Studio's login flow)
- **Database tables:**
  - `profiles` — user display name, avatar, channel name
  - `videos` — title, description, thumbnail_url, video_url, status (draft/public/unlisted/private), views, likes, comments_count, upload_date, duration
  - `comments` — video_id, author, text, likes, replies, timestamp
  - `user_roles` — role-based access (admin, user)
  - `playlists` — title, description, video list
  - `subtitles` — video_id, language, file_url
- **Storage buckets:** `videos` (for video files), `thumbnails` (for thumbnail images)

### Phase 2: Layout & Navigation (Dark Theme UI)
- **Dark theme** matching YouTube Studio's exact color palette (#282828 sidebar, #181818 background, white/gray text)
- **Left sidebar** with icon+label navigation: Dashboard, Content, Analytics, Comments, Subtitles, Customization, Audio Library
- **Top header bar** with channel avatar, search, create button, and notification bell
- Collapsible sidebar (icon-only mode)

### Phase 3: Dashboard Page
- Channel overview cards: current subscribers, watch time, top videos
- Recent video performance summary with mini charts (using Recharts)
- Latest comments preview
- "Studio news" section
- Quick action buttons (Upload, Go Live)

### Phase 4: Content Page
- **Video list table** with columns: visibility toggle, thumbnail preview, title, date, views, comments, likes
- Filter tabs: Videos, Shorts, Live, Posts
- Search and sort functionality
- Video detail/edit panel (title, description, tags, visibility, thumbnail upload)
- Upload dialog with drag-and-drop, progress bar, and metadata form

### Phase 5: Analytics Page
- Tab navigation: Overview, Content, Audience, Revenue (mock)
- Line/area charts for views, watch time, subscribers over time
- Top videos table with performance metrics
- Traffic sources breakdown (pie/bar chart)
- Date range picker

### Phase 6: Comments Page
- Comments list with video thumbnail, commenter info, comment text
- Filter: Published, Held for review
- Reply inline, like, pin, delete actions
- Search comments

### Phase 7: Subtitles Page
- List of videos with subtitle status
- Add/edit subtitles per video with language selector
- Upload subtitle files (SRT/VTT)

### Phase 8: Customization Page
- Channel branding: profile picture, banner image upload
- Basic info: channel name, description, links
- Preview of channel appearance

### Phase 9: Audio Library Page
- Browse free music/sound effects (mock data with categories)
- Search, filter by genre/mood/duration
- Play preview, "Add to video" action

