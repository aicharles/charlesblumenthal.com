"use client";
import { useState } from "react";
import { FaBluesky, FaXTwitter } from "react-icons/fa6";
import BlueskyFeed from "./BlueskyFeed";

const FEEDS = [
  { label: "Periwinkle", type: "bluesky", handle: "periwinkle.social" },
  { label: "Charles", type: "bluesky", handle: "charles.pwkl.social" },
  { label: "atproto", type: "bluesky", handle: "atproto.com" },
  { label: "Twitter", type: "twitter", handle: "pwkl_social" },
] as const;

export default function SocialFeeds() {
  const [active, setActive] = useState(0);
  const current = FEEDS[active];
  const isTwitter = current.type === "twitter";
  const Icon = isTwitter ? FaXTwitter : FaBluesky;

  return (
    <div>
      <p className="text-[10px] font-semibold text-warm-400 uppercase tracking-widest mb-3">
        Social Feeds
      </p>
      <div className="flex items-center gap-2 mb-4">
        <Icon
          size={16}
          className={`${isTwitter ? "text-warm-900" : "text-sky-500"} flex-shrink-0`}
        />
        <div className="flex flex-wrap gap-1.5">
          {FEEDS.map((f, i) => {
            const selected = i === active;
            const activeStyle =
              f.type === "twitter"
                ? "bg-warm-200 text-warm-900"
                : "bg-sky-100 text-sky-700";
            return (
              <button
                key={f.label}
                onClick={() => setActive(i)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  selected
                    ? activeStyle
                    : "text-warm-500 hover:text-warm-800 hover:bg-warm-100"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
      {isTwitter ? (
        <a
          href={`https://x.com/${current.handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center justify-center gap-3 text-center rounded-xl bg-warm-50 hover:bg-white border border-transparent hover:border-warm-200/60 hover:shadow-sm transition-all duration-200 p-6 min-h-[180px]"
        >
          <p className="text-sm text-warm-600 leading-relaxed max-w-xs">
            Twitter/X has no public API, unlike the AT Protocol. womp, womp.{" "}
            <span className="text-lg align-middle" role="img" aria-label="just sayin">
              &#128527;
            </span>
          </p>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-warm-900 group-hover:gap-2 transition-all">
            <FaXTwitter size={14} />@{current.handle}
          </span>
        </a>
      ) : (
        <BlueskyFeed key={current.handle} handle={current.handle} limit={6} />
      )}
    </div>
  );
}
