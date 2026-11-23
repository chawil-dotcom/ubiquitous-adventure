import React from 'react';
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from 'remotion';
import { BigTitle, Captions, Kicker, PauseCard, ProgressBar, ShortsBackdrop, Stamp, prog } from '../../lib/shorts';
import { ChartFrame, Curve, EndDot, GapArea, Pt, Scale, lastPt, makeScale, moneyShort } from '../../lib/chart';
import { VO } from './vo.gen';
import { FONT_BODY, FONT_DISPLAY } from '../../fonts';

// =============================================================================
// COMPOSITION CONFIG
// =============================================================================
export const compositionConfig = {
  id: 'Short13Compound',
  durationInSeconds: 39.5,
  fps: 30,
  width: 1080,
  height: 1920,
};

const GOLD = '#f5d76e'; // Alex — starts at 25, stops at 35
const BLUE = '#5fb7ef'; // Ben — starts at 35, keeps going to 65
const EASE_INOUT = Easing.bezier(0.37, 0, 0.63, 1);
const F = (s: number) => Math.round(s * 30);

// =============================================================================
// THE MATH — computed at render time, same formula as beats.json.money.
// $300/mo, 7%/yr, monthly compounding, deposit at month end. x = years since age 25.
//   Alex: deposits months 1..120 (age 25-35), then just compounds -> $421,453 (put in $36,000)
//   Ben:  deposits months 121..480 (age 35-65)                    -> $365,991 (put in $108,000)
// =============================================================================
const MONTHLY = 300;
const RATE = 0.07;
const YEARS = 40;
const series = (fromM: number, toM: number, rate: number): Pt[] => {
  const r = rate / 12;
  let bal = 0;
  const out: Pt[] = [{ x: 0, y: 0 }];
  for (let m = 1; m <= YEARS * 12; m++) {
    bal = bal * (1 + r) + (m > fromM && m <= toM ? MONTHLY : 0);
    out.push({ x: m / 12, y: bal });
  }
  return out;
};
const ALEX = series(0, 120, RATE);
const BEN = series(120, 480, RATE);
const ALEX_IN = series(0, 120, 0);
const BEN_IN = series(120, 480, 0);
const ALEX_FINAL = lastPt(ALEX).y; // 421_453
const BEN_FINAL = lastPt(BEN).y; //  365_991

const BOX = { x: 160, y: 560, w: 750, h: 440 };
const S = makeScale([0, YEARS], [0, 450_000], BOX);

// =============================================================================
// CUES — global frames, from the REAL ElevenLabs word times in vo.gen.ts
// =============================================================================
const HOOK_OUT = F(3.4);
const REWIND_IN = F(3.6);
const REWIND_OUT = F(5.4);
const ALEX_BAND = F(5.8); // "twenty five" @ 5.82
const ALEX_STOP = F(7.4); // "stops at thirty five" @ 7.05–8.2
const BEN_BAND = F(10.1); // "Ben starts at thirty five" @ 10.08
const PAUSE_FROM = F(13.8); // "Pause." @ 13.80
const PAUSE_DUR = F(3.45); // ...through "five?" @ 17.24
const BENIN_IN = F(17.4); // Ben's deposits draw, landing on "hundred and eight thousand" @ 18.04–18.7
const BENIN_OUT = F(18.8);
const ALEXIN_IN = F(19.9); // Alex's deposits draw, landing on "just thirty six" @ 20.04–21.4
const ALEXIN_OUT = F(21.2);
const GROW_IN = F(22.3); // "But Alex's money had ten extra years to compound" @ 22.30–25.9
const GROW_OUT = F(27.1); // heads land just before "Alex ends with..." @ 27.19
const ALEX_SAY = F(27.9); // "four hundred twenty one thousand" @ 27.92–29.4
const ALEX_SAY_END = F(29.5);
const BEN_SAY = F(29.75); // "Ben, three sixty six" @ 29.87–31.9
const BEN_SAY_END = F(31.6);
const PANEL_IN = F(32.0); // "A third of the money" @ 32.00
const WINS = F(33.9); // "and he still wins" @ 33.97
const LOOP = F(36.9); // after "Start early." — title and full state return under "Ten years can beat thirty."
const END = F(39.5);

const bump = (f: number, a: number, b: number) => Math.min(prog(f, a, a + 5), 1 - prog(f, b - 9, b));

// shaded age band — who is paying in, when
const Band: React.FC<{ s: Scale; from: number; to: number; color: string; p: number; label: string; opacity: number }> = ({
  s,
  from,
  to,
  color,
  p,
  label,
  opacity,
}) => {
  const x0 = s.sx(from);
  const x1 = s.sx(from + (to - from) * p);
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, opacity }}>
      <rect x={x0} y={s.box.y} width={Math.max(0, x1 - x0)} height={s.box.h} fill={color} opacity={0.13} />
      <line x1={x0} x2={x1} y1={s.box.y + s.box.h - 4} y2={s.box.y + s.box.h - 4} stroke={color} strokeWidth={8} />
      <text
        x={(x0 + s.sx(to)) / 2}
        y={s.box.y + 44}
        textAnchor="middle"
        fill={color}
        opacity={prog(p, 0.4, 0.9)}
        style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 2 }}
      >
        {label}
      </text>
    </svg>
  );
};

// the payoff table: put in vs at 65
const Panel: React.FC<{ opacity: number; third: number }> = ({ opacity, third }) => {
  const cell = (txt: string, color: string, big = false) => (
    <div style={{ flex: 1, textAlign: 'center', fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: big ? 58 : 44, color }}>
      {txt}
    </div>
  );
  const rowLabel = (txt: string) => (
    <div style={{ width: 200, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: 'rgba(255,255,255,0.6)' }}>
      {txt}
    </div>
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        width: 800,
        top: 1110,
        opacity,
        background: 'rgba(13,17,23,0.82)',
        border: '2px solid rgba(255,255,255,0.12)',
        borderRadius: 24,
        padding: '18px 28px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        {rowLabel('')}
        {cell('ALEX', GOLD)}
        {cell('BEN', BLUE)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
        {rowLabel('PUT IN')}
        <div style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
          <span
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 44,
              color: GOLD,
              display: 'inline-block',
              transform: `scale(${1 + 0.15 * third})`,
            }}
          >
            $36K
          </span>
        </div>
        {cell('$108K', BLUE)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {rowLabel('AT 65')}
        {cell(moneyShort(ALEX_FINAL), GOLD, true)}
        {cell(moneyShort(BEN_FINAL), BLUE, true)}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN — one persistent chart. Frame 0 is the payoff (both curves complete, deposits drawn,
// the table up). The setup rewinds it, the reveal re-draws it, and the loop lands back on it.
// =============================================================================
const Short13Compound: React.FC = () => {
  const f = useCurrentFrame();

  const punch =
    f < LOOP ? 1.05 - 0.05 * EASE_INOUT(prog(f, 0, 28)) : 1.0 + 0.05 * EASE_INOUT(prog(f, LOOP, END));

  const rewound = EASE_INOUT(prog(f, REWIND_IN, REWIND_OUT));
  const growth = Math.max(1 - rewound, EASE_INOUT(prog(f, GROW_IN, GROW_OUT)));
  const benIn = Math.max(1 - rewound, EASE_INOUT(prog(f, BENIN_IN, BENIN_OUT)));
  const alexIn = Math.max(1 - rewound, EASE_INOUT(prog(f, ALEXIN_IN, ALEXIN_OUT)));

  // age bands: drawn in the setup, gone by the time the deposit lines carry the story
  const bandOp = 1 - prog(f, BENIN_IN - 6, BENIN_IN + 10);
  const alexBand = EASE_INOUT(prog(f, ALEX_BAND, ALEX_STOP + 12));
  const benBand = EASE_INOUT(prog(f, BEN_BAND, BEN_BAND + 50));

  const headLabels = prog(growth, 0.6, 0.85);
  const alexPulse = bump(f, ALEX_SAY, ALEX_SAY_END);
  const benPulse = bump(f, BEN_SAY, BEN_SAY_END);

  const titleOp = Math.min(1, 1 - prog(f, HOOK_OUT, HOOK_OUT + 14) + prog(f, LOOP, LOOP + 20));
  const panelOp = Math.min(1, 1 - prog(f, REWIND_IN, REWIND_IN + 12) + prog(f, PANEL_IN, PANEL_IN + 12));
  const third = bump(f, F(32.2), F(33.4));

  return (
    <AbsoluteFill style={{ background: '#0f1216' }}>
      <ShortsBackdrop base="#0f1216" glow="#16263a" />

      <AbsoluteFill style={{ transform: `scale(${punch})` }}>
        <div style={{ opacity: titleOp }}>
          <BigTitle
            lines={[
              { text: '10 YEARS OF SAVING', color: GOLD },
              { text: 'BEAT 30', color: '#ffffff' },
            ]}
            subtitle="the compound interest head start"
            y={150}
            size={84}
            warm
          />
        </div>

        <Kicker text="ALEX · $300/MO · AGE 25→35" color={GOLD} y={200} at={F(4.0)} until={F(9.3)} />
        <Kicker text="BEN · $300/MO · AGE 35→65" color={BLUE} y={200} at={F(9.5)} until={F(13.6)} />
        <Kicker text="WHO PUT IN MORE?" color="#ffffff" y={200} at={F(17.3)} until={F(22.1)} />
        <Kicker text="+10 YEARS OF COMPOUNDING" color={GOLD} y={200} at={GROW_IN} until={F(31.8)} />
        <Kicker text="1/3 THE MONEY · STILL WINS" color={GOLD} y={200} at={PANEL_IN} until={F(36.6)} />

        <ChartFrame
          scale={S}
          yTicks={[0, 100_000, 200_000, 300_000, 400_000]}
          xTicks={[0, 10, 20, 30, 40]}
          xFormat={(v) => `age ${25 + v}`}
        />

        <Band s={S} from={0} to={10} color={GOLD} p={alexBand} label="ALEX PAYS" opacity={bandOp} />
        <Band s={S} from={10} to={40} color={BLUE} p={benBand} label="BEN PAYS" opacity={bandOp} />

        {/* what each of them actually deposited — dashed floors */}
        <Curve scale={S} pts={BEN_IN} color={BLUE} p={benIn} width={5} glow={0} dashed opacity={0.7} />
        <Curve scale={S} pts={ALEX_IN} color={GOLD} p={alexIn} width={5} glow={0} dashed opacity={0.7} />
        <EndDot scale={S} pts={BEN_IN} p={benIn} color={BLUE} label="Ben put in" dy={-50} anchor="end" plate opacity={prog(benIn, 0.7, 0.95)} pulse={bump(f, F(18.0), F(19.0))} />
        <EndDot scale={S} pts={ALEX_IN} p={alexIn} color={GOLD} label="Alex put in" dx={-200} dy={-24} anchor="end" plate opacity={prog(alexIn, 0.7, 0.95)} pulse={bump(f, F(20.6), F(21.6))} />

        {/* the gap Alex's head start buys */}
        <GapArea scale={S} upper={ALEX} lower={BEN} color={GOLD} p={growth} opacity={0.16} />
        <Curve scale={S} pts={BEN} color={BLUE} p={growth} width={8} />
        <Curve scale={S} pts={ALEX} color={GOLD} p={growth} width={8} />
        <EndDot scale={S} pts={ALEX} p={growth} color={GOLD} label="Alex at 65" dy={-70} dx={-10} anchor="end" plate pulse={alexPulse} opacity={headLabels} />
        <EndDot scale={S} pts={BEN} p={growth} color={BLUE} label="Ben at 65" dx={-230} dy={10} anchor="end" plate pulse={benPulse} opacity={headLabels} />

        <Panel opacity={panelOp} third={third} />
        <Stamp text="ALEX WINS" at={WINS} until={F(36.6)} color={GOLD} x={400} y={410} size={64} rotate={-6} />
      </AbsoluteFill>

      <Sequence from={PAUSE_FROM} durationInFrames={PAUSE_DUR}>
        <PauseCard title="PAUSE" subtitle="who has more at 65?" durSec={3.45} accent={GOLD} y={800} />
      </Sequence>

      <Captions lines={VO} y={1500} accent={GOLD} />
      <ProgressBar color={GOLD} />
    </AbsoluteFill>
  );
};

export default Short13Compound;
