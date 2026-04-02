"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import StarRating from "./StarRating";

type CommentData = {
  id: string;
  user_id: string;
  body: string;
  rating: number | null;
  created_at: string;
  profiles: { display_name: string | null } | null;
};

export default function CommentSection({
  routeId,
  userId,
  initialComments,
}: {
  routeId: string;
  userId: string | null;
  initialComments: CommentData[];
}) {
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(0);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async () => {
    if (!body.trim() || !userId) return;
    setSaving(true);
    await supabase.from("comments").insert({
      route_id: routeId,
      user_id: userId,
      body: body.trim(),
      rating: rating > 0 ? rating : null,
    });
    setSaving(false);
    setBody("");
    setRating(0);
    router.refresh();
  };

  const handleDelete = async (commentId: string) => {
    await supabase.from("comments").delete().eq("id", commentId);
    router.refresh();
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Comments ({initialComments.length})
      </h2>

      {/* Add comment form */}
      {userId ? (
        <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-4 mb-6">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your beta or experience..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 mb-3"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Rating:</span>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving || !body.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-md text-sm font-medium transition"
            >
              {saving ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-stone-100 dark:bg-stone-800 rounded-lg text-center text-sm text-stone-500">
          <a
            href="/auth/login"
            className="text-red-600 font-medium hover:underline"
          >
            Sign in
          </a>{" "}
          to leave a comment.
        </div>
      )}

      {/* Comment list */}
      <div className="space-y-4">
        {initialComments.map((comment) => {
          const profile = comment.profiles as { display_name: string | null } | null;
          return (
            <div
              key={comment.id}
              className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-medium text-sm">
                    {profile?.display_name || "Anonymous"}
                  </span>
                  <span className="text-xs text-stone-400 ml-2">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {comment.rating && (
                    <StarRating value={comment.rating} readonly />
                  )}
                  {userId === comment.user_id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-xs text-stone-400 hover:text-red-500 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm">{comment.body}</p>
            </div>
          );
        })}
        {initialComments.length === 0 && (
          <p className="text-center text-stone-400 py-4 text-sm">
            No comments yet. Be the first to share your experience!
          </p>
        )}
      </div>
    </div>
  );
}
