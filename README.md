# ubiquitous-adventure — faceless shorts studio

A Claude Code–driven factory for faceless YouTube Shorts (1080×1920, ~40s): you describe the
video, Claude writes the script, animates it in [Remotion](https://remotion.dev), voices it with
ElevenLabs (word-synced captions), and QA's it frame by frame.

Built on [hassancs91/claude-faceless-shorts-creator](https://github.com/hassancs91/claude-faceless-shorts-creator)
(MIT — see `LICENSE`; the original README is kept as [`README.upstream.md`](README.upstream.md)).

## Our shorts

| # | Title | Composition | Folder |
|---|---|---|---|
| 13 | **10 Years Of Saving Beat 30** — compound interest: Alex saves $300/mo from 25–35 then stops, Ben from 35–65; Alex puts in a third as much and ends ahead ($421K vs $366K) | `Short13Compound` | [`shorts/short-13-compound/`](shorts/short-13-compound/) |

## Using it

Open the repo in Claude Code and ask, e.g. *"make a short about the rule of 72"*. Skills in
`.claude/skills/` (`/make-short`, `/make-ai-short`, `/make-vox`, `/suggest-sfx`,
`/vidtsx-2d-generator`) pick it up; `CLAUDE.md` has the conventions.

Setup:

```bash
cp .env.example .env          # ELEVENLABS_API_KEY (voice), GEMINI_API_KEY / FAL_KEY (images, AI clips)
cd remotion && npm ci
```

Needs Node 18+, Python 3.10+, `ffmpeg`/`ffprobe`.

Render a short:

```bash
cd remotion && npm run gen
node scripts/render-all.mjs Short13Compound --scale=1        # -> remotion/out/Short13Compound.mp4
cd .. && python tools/gen_voice.py --beats shorts/short-13-compound/beats.json   # voice/voice.wav
```

then mux: `ffmpeg -i remotion/out/Short13Compound.mp4 -i shorts/short-13-compound/voice/voice.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -t 39.5 out.mp4`.
Rendered videos and voice files are gitignored (regenerable).

## Changes from upstream

- **House voice:** ElevenLabs "Mike" (`cBTYF7NiJbR8Bvmdeuse`) is the `gen_voice.py` default.
- **Local fonts:** `remotion/src/fonts.ts` loads the brand fonts from `media/fonts/` (the same
  Google Fonts files) instead of fetching them at render time — renders work offline and in
  Claude Code cloud sandboxes, where Remotion's browser bypasses the network proxy.
- **Render browser:** `frames.mjs` / `render-all.mjs` use `$REMOTION_BROWSER_EXECUTABLE`, else the
  cloud sandbox's preinstalled headless Chrome if present, else Remotion's usual download.
- **Upstream demo media not included:** the original author's AI-generated clips and images
  (`media/projects/`, ~98 MB) were left out. The upstream example compositions that use them
  (the blue-man ai-shorts, vox-1-coffee, short-7-kids) will render with missing images unless
  you copy those files over from the upstream repo. All TSX examples (short-1…12 except 7) are
  pure code and render as-is.
