import React from 'react';
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from 'remotion';
import { BigTitle, Captions, Kicker, PauseCard, ProgressBar, ShortsBackdrop, Stamp, prog } from '../../lib/shorts';
import { ChartFrame, Curve, Pt, Scale, makeScale, moneyShort, slicePts, lastPt } from '../../lib/chart';
import { FONT_BODY, FONT_DISPLAY } from '../../fonts';
import { VO } from './vo.gen';

// =============================================================================
// COMPOSITION CONFIG
// =============================================================================
export const compositionConfig = {
  id: 'Short14Rule72',
  durationInSeconds: 41,
  fps: 30,
  width: 1080,
  height: 1920,
};

const GOLD = '#f5d76e'; // money working for you
const RED = '#ef5f6b'; // debt — the rule working against you
const DIM = 'rgba(255,255,255,0.35)';
const EASE_INOUT = Easing.bezier(0.37, 0, 0.63, 1);
const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const F = (s: number) => Math.round(s * 30);

// =============================================================================
// THE MATH — $10,000 at 8%/yr, annual compounding (beats.json.money).
// 72 / 8 = 9 years; exact doubling time ln2/ln1.08 = 9.006 years.
//   year 9 -> $19,990 · year 18 -> $39,960 · year 27 -> $79,881
// Sampled uniformly in x, so curve progress p = 1/3 lands exactly on year 9.
// =============================================================================
const P0 = 10_000;
const R = 0.08;
const YEARS = 27;
const STEPS = 27 * 12;
const GROWTH: Pt[] = Array.from({ length: STEPS + 1 }, (_, i) => {
  const x = (i / STEPS) * YEARS;
  return { x, y: P0 * Math.pow(1 + R, x) };
});
const DOUBLINGS = [9, 18, 27].map((x) => ({ x, y: P0 * Math.pow(1 + R, x) }));

const BOX = { x: 170, y: 500, w: 720, h: 520 };
const S = makeScale([0, YEARS], [0, 90_000], BOX);

// =============================================================================
// CUES — global frames from the REAL ElevenLabs word times (vo.gen.ts)
// =============================================================================
const HOOK_OUT = F(3.0);
const REWIND_IN = F(3.2);
const REWIND_OUT = F(4.6);
const EQ_72 = F(4.3); // "seventy two" @ 4.31
const EQ_DIV = F(5.45); // "Divide it by your interest rate" @ 5.49
const EQ_RATE = F(8.3); // "eight percent" @ 8.35
const EQ_YEARS = F(10.93); // "is nine" @ 10.96
const START_DOT = F(15.5); // "Ten thousand dollars" @ 15.53
const PAUSE_FROM = F(14.8); // "Pause." @ 14.80
const PAUSE_DUR = F(4.95); // ...through "How much?" @ 19.67
// each doubling segment lands on the word that names its value
const SEG = [
  { from: F(20.0), to: F(20.85), say: F(20.82) }, // "Nine years, twenty thousand" @ 20.82
  { from: F(22.2), to: F(23.15), say: F(23.15) }, // "Eighteen years, forty thousand" @ 23.16
  { from: F(24.4), to: F(25.75), say: F(25.75) }, // "Twenty seven years, eighty thousand" @ 25.76
];
const TWIST = F(27.2); // "But it works against you too" @ 27.20
const DEBT_EQ = F(29.9); // "credit card" @ 29.91
const DEBT_RATE = F(30.45); // "twenty four percent" @ 30.46
const DEBT_YEARS = F(32.8); // "about three years" @ 32.83
const LOOP = F(36.0); // "Seventy two, divided by your rate" @ 36.00
const TITLE_BACK = F(38.3); // "That's your doubling time" @ 38.33
const END = F(41.0);

const bump = (f: number, a: number, b: number) => Math.min(prog(f, a, a + 5), 1 - prog(f, b - 9, b));
const pop = (f: number, at: number) => EASE_OUT(prog(f, at, at + 10));

// =============================================================================
// EQUATION — "72 ÷ rate = years", each slot appears on its word
// =============================================================================
const Slot: React.FC<{ text: string; color: string; show: number; size?: number; sub?: string }> = ({
  text,
  color,
  show,
  size = 150,
  sub,
}) => (
  <div style={{ textAlign: 'center', opacity: show, transform: `scale(${0.7 + 0.3 * show})` }}>
    <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: size, lineHeight: 1, color }}>{text}</div>
    <div
      style={{
        fontFamily: FONT_BODY,
        fontWeight: 600,
        fontSize: 26,
        letterSpacing: 3,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 10,
        height: 30,
      }}
    >
      {sub ?? ''}
    </div>
  </div>
);

const Equation: React.FC<{
  rate: string;
  years: string;
  color: string;
  s72: number;
  sDiv: number;
  sRate: number;
  sYears: number;
  pulseRate?: number;
  pulseYears?: number;
  opacity: number;
}> = ({ rate, years, color, s72, sDiv, sRate, sYears, pulseRate = 0, pulseYears = 0, opacity }) => (
  <div
    style={{
      position: 'absolute',
      left: 60,
      right: 60,
      top: 1115,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: 26,
      opacity,
    }}
  >
    <Slot text="72" color="#ffffff" show={s72} sub="THE RULE" />
    <Slot text="÷" color={DIM} show={sDiv} />
    <div style={{ position: 'relative' }}>
      {/* placeholder until the rate is said */}
      <div style={{ position: 'absolute', inset: 0, opacity: sDiv * (1 - sRate) }}>
        <Slot text="?" color={DIM} show={1} sub="RATE %" />
      </div>
      <div style={{ transform: `scale(${1 + 0.15 * pulseRate})` }}>
        <Slot text={rate} color={color} show={sRate} sub="RATE %" />
      </div>
    </div>
    <Slot text="=" color={DIM} show={sYears} />
    <div style={{ transform: `scale(${1 + 0.15 * pulseYears})` }}>
      <Slot text={years} color={color} show={sYears} sub="YEARS TO ×2" />
    </div>
  </div>
);

// a doubling marker: guide lines to both axes + a chip
const Doubling: React.FC<{ s: Scale; x: number; y: number; show: number; pulse: number; label: string }> = ({
  s,
  x,
  y,
  show,
  pulse,
  label,
}) => {
  const cx = s.sx(x);
  const cy = s.sy(y);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: show }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
        <line x1={cx} x2={cx} y1={cy} y2={s.box.y + s.box.h} stroke={GOLD} strokeOpacity={0.45} strokeWidth={3} strokeDasharray="8 10" />
        <line x1={s.box.x} x2={cx} y1={cy} y2={cy} stroke={GOLD} strokeOpacity={0.3} strokeWidth={3} strokeDasharray="8 10" />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: cx,
          top: cy,
          width: 26,
          height: 26,
          marginLeft: -13,
          marginTop: -13,
          borderRadius: 999,
          background: GOLD,
          transform: `scale(${1 + 0.5 * pulse})`,
          boxShadow: `0 0 ${30 + 30 * pulse}px ${GOLD}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: cx - 24,
          top: cy - 18,
          transform: `translate(-100%, -100%) scale(${1 + 0.12 * pulse})`,
          transformOrigin: 'right bottom',
          background: 'rgba(13,17,23,0.86)',
          border: `2px solid ${GOLD}${pulse > 0.5 ? 'cc' : '44'}`,
          borderRadius: 14,
          padding: '6px 14px',
          whiteSpace: 'nowrap',
          textAlign: 'right',
        }}
      >
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 42, color: GOLD }}>{moneyShort(y)}</div>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 22, letterSpacing: 2, color: 'rgba(255,255,255,0.72)' }}>
          {label}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN — one persistent chart + equation. Frame 0 = the payoff (three doublings drawn,
// 72 ÷ 8 = 9). The setup rewinds it, the equation is built word by word, the reveal re-draws
// the doublings, the twist turns the same rule on debt, and the loop restores frame 0.
// =============================================================================
const Short14Rule72: React.FC = () => {
  const f = useCurrentFrame();

  const punch =
    f < TITLE_BACK ? 1.05 - 0.05 * EASE_INOUT(prog(f, 0, 28)) : 1.0 + 0.05 * EASE_INOUT(prog(f, TITLE_BACK, END));

  const rewound = EASE_INOUT(prog(f, REWIND_IN, REWIND_OUT));
  const full = 1 - rewound; // the hook state, rewinding away

  // curve progress in thirds — each third is exactly one doubling period
  const segP = SEG.map((s) => EASE_INOUT(prog(f, s.from, s.to)));
  const growth = Math.max(full, (segP[0] + segP[1] + segP[2]) / 3);
  const marks = SEG.map((s, i) => Math.max(full, prog(f, s.say - 4, s.say + 4)));
  const pulses = SEG.map((s) => bump(f, s.say, s.say + 24));
  const startDot = Math.max(full, prog(f, START_DOT, START_DOT + 8));

  // twist: the growth chart steps back while the debt equation takes the stage
  const twistDim = prog(f, TWIST, TWIST + 15) * (1 - prog(f, LOOP, LOOP + 15));
  const chartOp = 1 - 0.65 * twistDim;

  // equations: the saving one (gold) is built in the setup; the debt one (red) swaps in on the twist
  const debtOn = prog(f, DEBT_EQ - 6, DEBT_EQ + 6) * (1 - prog(f, LOOP - 6, LOOP + 6));
  const saveEq = {
    s72: Math.max(full, pop(f, EQ_72)),
    sDiv: Math.max(full, pop(f, EQ_DIV)),
    sRate: Math.max(full, pop(f, EQ_RATE)),
    sYears: Math.max(full, pop(f, EQ_YEARS)),
  };

  const titleOp = Math.min(1, 1 - prog(f, HOOK_OUT, HOOK_OUT + 12) + prog(f, TITLE_BACK, TITLE_BACK + 20));

  return (
    <AbsoluteFill style={{ background: '#0f1216' }}>
      <ShortsBackdrop base="#0f1216" glow="#2a2614" />

      <AbsoluteFill style={{ transform: `scale(${punch})` }}>
        <div style={{ opacity: titleOp }}>
          <BigTitle
            lines={[
              { text: 'THE RULE OF 72', color: GOLD },
              { text: 'WHEN MONEY DOUBLES', color: '#ffffff' },
            ]}
            y={150}
            size={78}
            warm
          />
        </div>

        <Kicker text="ONE NUMBER: 72" color={GOLD} y={200} at={F(3.6)} until={F(7.5)} />
        <Kicker text="8% A YEAR" color={GOLD} y={200} at={F(8.0)} until={F(12.0)} />
        <Kicker text="DOUBLES EVERY 9 YEARS" color={GOLD} y={200} at={F(12.1)} until={F(14.6)} />
        <Kicker text="$10K · LEFT ALONE · 8%" color={GOLD} y={200} at={F(19.8)} until={F(27.0)} />
        <Kicker text="IT WORKS ON DEBT TOO" color={RED} y={200} at={TWIST} until={F(35.8)} />

        <div style={{ opacity: chartOp }}>
          <ChartFrame
            scale={S}
            yTicks={[0, 20_000, 40_000, 60_000, 80_000]}
            xTicks={[0, 9, 18, 27]}
            xFormat={(v) => (v === 0 ? 'today' : `year ${v}`)}
          />
          <Curve scale={S} pts={GROWTH} color={GOLD} p={growth} width={8} />
          {/* the starting $10K */}
          <div style={{ opacity: startDot }}>
            <div
              style={{
                position: 'absolute',
                left: S.sx(0),
                top: S.sy(P0),
                width: 22,
                height: 22,
                marginLeft: -11,
                marginTop: -11,
                borderRadius: 999,
                background: '#ffffff',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: S.sx(0) + 20,
                top: S.sy(P0) + 6,
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                fontSize: 36,
                color: '#ffffff',
              }}
            >
              $10K
            </div>
          </div>
          {DOUBLINGS.map((d, i) => (
            <Doubling key={d.x} s={S} x={d.x} y={d.y} show={marks[i]} pulse={pulses[i]} label={`×${2 ** (i + 1)} · YEAR ${d.x}`} />
          ))}
          {/* the moving head while a segment is drawing */}
          {growth > 0.002 && growth < 0.998 ? (
            <div
              style={{
                position: 'absolute',
                left: S.sx(lastPt(slicePts(GROWTH, growth)).x),
                top: S.sy(lastPt(slicePts(GROWTH, growth)).y),
                width: 20,
                height: 20,
                marginLeft: -10,
                marginTop: -10,
                borderRadius: 999,
                background: GOLD,
                boxShadow: `0 0 30px ${GOLD}`,
              }}
            />
          ) : null}
        </div>

        <Equation
          rate="8"
          years="9"
          color={GOLD}
          {...saveEq}
          pulseRate={bump(f, EQ_RATE, EQ_RATE + 24)}
          pulseYears={bump(f, EQ_YEARS, EQ_YEARS + 24)}
          opacity={1 - debtOn}
        />
        <Equation
          rate="24"
          years="3"
          color={RED}
          s72={1}
          sDiv={1}
          sRate={pop(f, DEBT_RATE)}
          sYears={pop(f, DEBT_YEARS)}
          pulseRate={bump(f, DEBT_RATE, DEBT_RATE + 24)}
          pulseYears={bump(f, DEBT_YEARS, DEBT_YEARS + 24)}
          opacity={debtOn}
        />

        <Stamp text="DEBT ×2 IN ~3 YEARS" at={F(33.1)} until={F(35.8)} color={RED} x={540} y={780} size={62} rotate={-5} />
      </AbsoluteFill>

      <Sequence from={PAUSE_FROM} durationInFrames={PAUSE_DUR}>
        <PauseCard title="PAUSE" subtitle="$10K · 27 years · how much?" durSec={4.95} accent={GOLD} y={800} />
      </Sequence>

      <Captions lines={VO} y={1500} accent={GOLD} />
      <ProgressBar color={GOLD} />
    </AbsoluteFill>
  );
};

export default Short14Rule72;
