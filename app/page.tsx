"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setBookmarks(data);
    }
  };

  const addBookmark = async () => {
    console.log("User:", user);

    const { data, error } = await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ]);

    console.log("Error:", error);
    console.log("Data:", data);
  };
fetchBookmarks()
  useEffect(() => {
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);

    if (data.user) {
      fetchBookmarks();
    }
  };

  getUser();

  const channel = supabase
    .channel("bookmarks-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks",
      },
      () => {
        fetchBookmarks();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);


  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };
  const deleteBookmark = async (id: string) => {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
  } else {
    fetchBookmarks();
  }
};


  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-6">Smart Bookmark App</h1>

      {!user ? (
        <button
          onClick={loginWithGoogle}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Login with Google
        </button>
      ) : (
        <>
          <p className="mb-4">Welcome {user.email}</p>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 mr-2"
          />

          <input
            type="text"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-2 mr-2"
          />

          <button
            onClick={addBookmark}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Bookmark
          </button>

          <div className="mt-6 space-y-2">
  {bookmarks.map((bm) => (
    <div
      key={bm.id}
      className="border p-3 flex justify-between items-center"
    >
      <div>
        <p className="font-semibold">{bm.title}</p>
        <a
          href={bm.url}
          target="_blank"
          className="text-blue-500 text-sm"
        >
          {bm.url}
        </a>
      </div>

      <button
        onClick={() => deleteBookmark(bm.id)}
        className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
      >
        Delete
      </button>
    </div>
  ))}
</div>


<br />

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
          >
            Logout
          </button>
        </>
      )}
    </main>
  );
}
