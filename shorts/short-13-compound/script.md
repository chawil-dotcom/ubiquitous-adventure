# short-13 · Money math — "10 Years Of Saving Beat 30"

**Composition:** `Short13Compound` (1080×1920 @30, 39.5s) · reuses `lib/chart.tsx`
**Voice:** ElevenLabs "Mike" (`cBTYF7NiJbR8Bvmdeuse`)

## The math (recomputed)
$300/month, 7%/yr, monthly compounding, deposit at month end, measured at age 65:

| | pays in | put in | at 65 |
|---|---|---|---|
| Alex | age 25–35 (10 yrs), then stops | $36,000 | **$421,453** |
| Ben | age 35–65 (30 yrs) | $108,000 | **$365,991** |

Alex puts in one third as much and finishes $55,462 ahead.

## Beat sheet (real ElevenLabs word times)
| time | beat | on screen | VO |
|---|---|---|---|
| 0–3.4 | HOOK | full chart, both curves, table, title | "Ten years of saving beat thirty." |
| 3.6–13.2 | SETUP | chart rewinds; age bands draw: Alex 25→35, Ben 35→65 | "Alex invests three hundred a month from twenty five, then stops at thirty five." / "Ben starts at thirty five, and keeps going until sixty five." |
| 13.8–17.2 | QUIZ | PauseCard | "Pause. Who has more at sixty five?" |
| 17.3–31.9 | REVEAL | deposit lines land on $108K / $36K; curves grow; heads pulse on their numbers | "Ben puts in a hundred and eight thousand. Alex? Just thirty six." / "But Alex's money had ten extra years to compound." / "At seven percent, Alex ends with four hundred twenty one thousand. Ben, three sixty six." |
| 32.0–35.2 | TWIST | table returns, $36K pulses on "third", ALEX WINS stamp | "A third of the money, and he still wins." |
| 36.0–39.5 | LOOP | title returns, punch-in reverses; last frame == frame 0 | "Start early. Ten years can beat thirty." |

## Sound
- SFX: `sfx-plan.json`, 100% library. Hero moments: curves land (riser → impact @ 27.1), payoff table (whoosh @ 32.0), ALEX WINS (stamp + chime @ 33.9). The rewind and the loop both use `whoosh-reverse`, so they rhyme.
- Music auditions: `lofi-warm` and `cinematic-min`, hard-ducked under the voice. All mixes ≈ −15.3 LUFS.
