# CLAUDE.md - charlesblumenthal.com

## What this is
Personal website for Charles Blumenthal, founder of [Periwinkle](https://periwinkle.social) (managed AT Protocol PDS hosting). Previously a data engineer at McKinsey. Based in Berlin.

## Stack
- Next.js 15 (App Router, static export) + TypeScript + Tailwind CSS 3
- Framer Motion for scroll animations
- Hosted on AWS: S3 + CloudFront, deployed via GitHub Actions
- Infrastructure managed with Terraform (see `infrastructure/`)

## Project structure
- `website/` - Next.js app (build with `cd website && ./node_modules/.bin/next build`)
- `infrastructure/bootstrap/` - One-time AWS/IAM setup
- `infrastructure/website/` - S3, CloudFront, Route53, ACM

## Content preferences
- No emdashes. Use regular dashes.
- No email address on the site.
- Keep copy concise and conversational. Warm tone, not corporate.
- Projects section exists but is hidden (keep the code, don't render it).

## Design
- Warm, approachable aesthetic. Not generic or corporate.
- Color palette: warm neutrals (`warm-*`) with periwinkle (`periwinkle-*`) accents. Mostly whites.
- Fonts: DM Sans (body), DM Mono (logo/display)
- Rounded shapes (`rounded-2xl` cards, `rounded-full` buttons/pills)
- Frosted-glass navbar, scroll-triggered fade-in animations

## Interactive design channel
- `tools/design-channel.ts` is a Claude Code channel for designing the live site by clicking on it. Registered as `design` in `.mcp.json`.
- Launch: `claude --dangerously-load-development-channels server:design`, then open http://localhost:3333. It spawns `next dev` (port 4321) and proxies it on 3333 with a click-to-comment overlay.
- Clicking the page sends a comment (with page path + CSS selector) to Claude; Claude edits the matching component under `website/src`, Next fast-refreshes, a toast confirms.
- Localhost-only and unauthenticated - don't expose port 3333 to a network.

## Working with Charles
- Be direct. Don't over-explain.
- Don't add things that weren't asked for.
- Verify accuracy of content - don't make up stats or embellish roles.
