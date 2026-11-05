# Netlify deployment

This project is Netlify-ready and does not require Supabase.

## What is stored where
- Wedding config: Netlify Blobs
- RSVPs: Netlify Blobs
- Admin password hash: Netlify Blobs
- Admin-uploaded media: Netlify Blobs
- Static HTML/CSS/JS/assets: deployed normally

Netlify Blobs is persistent across deploys for site-wide stores.

## Deploy
1. Create a GitHub repository and push this folder.
2. In Netlify, choose Add new project → Import an existing project → GitHub.
3. Select the repository.
4. Build command: leave empty.
5. Publish directory: `.`
6. Deploy.

`netlify.toml` already configures the Functions directory and Node 20.

## First admin login
Open `/admin.html`. The first time, create an admin password of at least 8 characters.

## Local Netlify-style testing
Use `npx netlify dev` from this folder if you want to test the Netlify Functions locally. The existing `node server/index.js` is still available for the simple local server.

## Large music/video uploads
Netlify Functions have a request-size limit for binary payloads. Small images and audio work, but large MP3/MP4 uploads can exceed the limit. For large media, keep the file on an external object store and paste its URL into Admin, or switch the media storage to Supabase Storage.

## RSVP and Supabase
Supabase is NOT required for RSVP. This project stores RSVPs in Netlify Blobs.

Supabase is useful when you want a relational Postgres database, fine-grained Storage policies, or direct large-file media uploads. It is an optional alternative, not a requirement for this project.
