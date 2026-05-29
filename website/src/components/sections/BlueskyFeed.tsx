"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBluesky } from "react-icons/fa6";

interface BlueskyPost {
  uri: string;
  cid: string;
  author: {
    handle: string;
    displayName?: string;
    avatar?: string;
  };
  record: {
    text: string;
    createdAt: string;
  };
  likeCount?: number;
  repostCount?: number;
  replyCount?: number;
}

interface FeedItem {
  post: BlueskyPost;
  reason?: { $type: string };
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function BlueskyFeed({
  handle,
  limit = 5,
}: {
  handle: string;
  limit?: number;
}) {
  const [posts, setPosts] = useState<BlueskyPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const res = await fetch(
          `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${handle}&limit=${limit}&filter=posts_no_replies`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const feedPosts = data.feed
          .filter((item: FeedItem) => !item.reason)
          .map((item: FeedItem) => item.post)
          .slice(0, limit);
        setPosts(feedPosts);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFeed();
  }, [handle, limit]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-warm-100 rounded-xl h-20"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="text-sm text-warm-400 italic">No posts to show.</p>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => {
        const postId = post.uri.split("/").pop();
        const postUrl = `https://bsky.app/profile/${post.author.handle}/post/${postId}`;

        return (
          <motion.a
            key={post.uri}
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3.5 rounded-xl bg-warm-50 hover:bg-white border border-transparent hover:border-warm-200/60 hover:shadow-sm transition-all duration-200 group"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-2.5">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                  <FaBluesky size={14} className="text-sky-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-warm-900 truncate">
                    {post.author.displayName || post.author.handle}
                  </span>
                  <span className="text-[10px] text-warm-400">
                    {timeAgo(post.record.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-warm-600 leading-relaxed mt-0.5 line-clamp-3">
                  {post.record.text}
                </p>
              </div>
            </div>
          </motion.a>
        );
      })}
    </div>
  );
}
