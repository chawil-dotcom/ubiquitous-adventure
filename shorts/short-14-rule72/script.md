# short-14 · Money math — "The Rule Of 72"

**Composition:** `Short14Rule72` (1080×1920 @30, 41s) · reuses `lib/chart.tsx`
**Voice:** ElevenLabs "Mike" (`cBTYF7NiJbR8Bvmdeuse`)
**Hook promise:** one number tells you when your money doubles.

## The math (verified)
- Rule of 72: years to double ≈ 72 ÷ annual rate (%). At 8%: 72/8 = **9**; exact ln2/ln1.08 = **9.006 years**.
- $10,000 at 8%, annual compounding: year 9 **$19,990** · year 18 **$39,960** · year 27 **$79,881** (≈ $20K / $40K / $80K).
- 24% APR card, nothing paid: doubles in **2.92 y** (monthly compounding) / **3.22 y** (annual). 72/24 = 3 → "about three years".
- The curve is computed at render time from the same formula (`P0·1.08^x`, sampled uniformly in x), so curve progress 1/3, 2/3, 1 is exactly years 9 / 18 / 27.

## Beat sheet (real ElevenLabs word times)
| time | beat | on screen | VO |
|---|---|---|---|
| 0–3.0 | HOOK | full chart, three doublings, `72 ÷ 8 = 9`, title | "One number tells you when your money doubles." |
| 3.2–14.4 | SETUP | chart + equation rewind; equation rebuilds slot by slot: 72 (4.31) → ÷ ? (5.49) → 8 (8.35) → = 9 (10.96) | "It's seventy two. Divide it by your interest rate." / "Earning eight percent? Seventy two divided by eight is nine." / "Your money doubles every nine years." |
| 14.8–19.7 | QUIZ | PauseCard; $10K start dot appears on "Ten thousand" | "Pause. Ten thousand dollars, left alone for twenty seven years. How much?" |
| 20.0–27.0 | REVEAL | curve draws one doubling per line; $20K / $40K / $80K chips land on their words (20.82 / 23.15 / 25.76) | "Nine years, twenty thousand." / "Eighteen years, forty thousand." / "Twenty seven years, eighty thousand." |
| 27.2–35.8 | TWIST | chart dims; equation turns red: 24 (30.46) → = 3 (32.83); DEBT ×2 IN ~3 YEARS stamp | "But it works against you too." / "Leave a credit card at twenty four percent, and your debt doubles in about three years." |
| 36.0–41.0 | LOOP | gold equation + chart restore on "Seventy two"; title back on "That's your doubling time"; last frame == frame 0 | "Seventy two, divided by your rate. That's your doubling time." |

## Production notes
- Frame 0 is the payoff; the rewind is the setup; the reveal re-draws it, so the loop closes for free (short-10's trick).
- The equation is the second persistent canvas: the twist swaps its numbers instead of cutting to a new scene.
- QA caught a three-line title colliding with the $80K chip → shortened to "WHEN MONEY DOUBLES" and enlarged the plot box.
- SFX: `sfx-plan.json` (100% library). Music audition: `lofi-warm`. Both mixes ≈ −15.6 LUFS.
