# Smart Bookmark App

A simple bookmark manager built as part of a Fullstack screening task.
The application allows users to log in with Google, add bookmarks, view them in real time, and delete them. Each user can only see their own bookmarks.

---

## Live Demo

(Add your Vercel URL here)

## GitHub Repository

(Add your repo link here)

---

## Features

* Google OAuth login (Supabase Auth)
* Add bookmarks (title + URL)
* Private bookmarks per user
* Delete bookmarks
* Realtime updates across tabs
* Responsive UI using Tailwind CSS
* Deployed on Vercel

---

## Tech Stack

Frontend:

* Next.js (App Router)
* Tailwind CSS

Backend / Services:

* Supabase Auth
* Supabase PostgreSQL Database
* Supabase Realtime

Deployment:

* Vercel

---

## Project Structure

```
smart-bookmark/
│
├── app/
│   └── page.tsx        # Main UI and logic
│
├── lib/
│   └── supabase.ts     # Supabase client configuration
│
├── .env.local          # Environment variables
└── package.json
```

---

## Supabase Setup

### Authentication

Google OAuth is configured using Supabase Auth.
Users log in through Google and Supabase manages sessions.

---

### Database Table

Table name: `bookmarks`

Columns:

| Column     | Type      |
| ---------- | --------- |
| id         | uuid      |
| title      | text      |
| url        | text      |
| user_id    | uuid      |
| created_at | timestamp |

Row Level Security (RLS) is enabled to ensure users can only access their own bookmarks.

Policies:

* SELECT → user_id = auth.uid()
* INSERT → user_id = auth.uid()
* DELETE → user_id = auth.uid()

---

## Code Explanation

### Supabase Client (lib/supabase.ts)

This file initializes the Supabase connection using environment variables.

```ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

---

### Authentication Logic

User login is handled using:

```ts
supabase.auth.signInWithOAuth({
  provider: "google",
});
```

Logout:

```ts
supabase.auth.signOut();
```

To get logged-in user:

```ts
supabase.auth.getUser();
```

---

### Adding Bookmarks

Bookmarks are inserted into the database:

```ts
await supabase.from("bookmarks").insert([
  {
    title,
    url,
    user_id: user.id,
  },
]);
```

---

### Fetching Bookmarks

Bookmarks are fetched and displayed in descending order:

```ts
supabase
  .from("bookmarks")
  .select("*")
  .order("created_at", { ascending: false });
```

---

### Deleting Bookmarks

Each bookmark can be removed using:

```ts
supabase
  .from("bookmarks")
  .delete()
  .eq("id", id);
```

---

### Realtime Updates

Supabase realtime subscription automatically refreshes bookmarks when changes occur:

```ts
supabase
  .channel("bookmarks-changes")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "bookmarks" },
    () => fetchBookmarks()
  )
  .subscribe();
```

This ensures bookmarks update across multiple tabs without refreshing.

---

## Running Locally

1. Clone repository

```
git clone <repo-url>
cd smart-bookmark
```

2. Install dependencies

```
npm install
```

3. Create `.env.local`

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

4. Run development server

```
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Deployment

The app is deployed on Vercel.

Steps:

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

---

## Future Improvements

* Bookmark categories/tags
* Search and filter
* Edit bookmark feature
* Better UI and animations
* Pagination for large lists

---

## Author

Anchit Julaniya
Fullstack MERN Developer
