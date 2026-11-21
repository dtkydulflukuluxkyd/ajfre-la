AJFRE.LA V6 COMMUNITY PATCH

Files: index.html, styles.css, app.js, supabase-v6.sql
Keep your existing config.js unchanged.

Install order:
1. Back up current repository ZIP.
2. Replace index.html, styles.css, app.js with the files in this patch. Do NOT replace config.js.
3. In Supabase SQL Editor, run supabase-v6.sql once. It only creates four new community tables and policies; it does not alter manhwa, chapters, storage, or admin login.
4. Deploy via GitHub commit and test Community, title request, comments, history.

Community links are configured near the bottom of app.js in COMMUNITY_LINKS. Update telegram/help/discord/bot values later.
Announcements and translator directory are read from Supabase tables announcements and translators. Add/manage their rows using Supabase Table Editor for now.

Important: anonymous requests/comments are publicly insertable. Add moderation/rate-limiting before wide public promotion. Do not publish personal contact details without consent. Only upload works you own or are authorized to distribute.
