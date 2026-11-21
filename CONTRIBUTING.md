# Contributing to The Hackers Bay

## Run in one command

From the checkout with Node.js 22 or later:

```sh
npm run dev
```

Open [the local site](http://127.0.0.1:4173/hackersbay). The sample room, browser-local RSVP and intro paths, and demo race work with no environment variables. Use `npm ci` if you want the optional Redis and provider dependencies.

## Deploy

Import this repository into Vercel as an **Other** project. The checked-in configuration runs `npm run build`, exposes `dist/`, and keeps the serverless API at `api/hackersbay.js`. Use a preview deployment to test a change before production. For shared events, intro receipts, and leaderboards, configure Redis. Live provider keys belong in Vercel environment settings. [Provider settings](README.md#how-the-sponsors-are-used)

The canonical live site is hosted by Corvus. This repository contains the standalone implementation and works as its own Vercel project. [Live site](https://corvus.gent/hackersbay)

## Code map

| Path | Where to work |
| --- | --- |
| `public/hackersbay/*.html` | Landing, creator, event, organizer, demos, and race pages |
| `public/hackersbay/assets/` | Browser UI, matching, seeded event data, and race animation |
| `lib/hackersbay/` | Public imports, event storage, provider adapters, race scoring receipts, and terminal outputs |
| `api/hackersbay.js` | Shared serverless request handler |
| `vercel.json`, `scripts/dev.mjs` | Production rewrites and local preview |
| `apps/cli/` | Zero-dependency terminal package |
| `apps/macos/`, `app/` | Native SwiftUI and Electron desktop sources |
| `video/` | Remotion compositions and render workflow |

Check changes through the normal route at a phone width and run `npm run build` before opening a pull request. For provider work, exercise both the credentialed path and the labeled demo. Include what you tested and any remaining fallback in the pull request. [Open issues](https://github.com/Corvus-gent/the-hackers-bay/issues)
