// Brand 5-font system, served from local copies in media/fonts/ (the same Google Fonts files
// @remotion/google-fonts would fetch). Local because the render browser connects directly,
// bypassing the sandbox proxy, so remote font downloads fail there.
import { continueRender, delayRender, staticFile } from 'remotion';

const FILES: [string, string, string][] = [
  ['Space Grotesk', '500', 'fonts/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2'],
  ['Space Grotesk', '600', 'fonts/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2'],
  ['Space Grotesk', '700', 'fonts/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2'],
  ['Inter', '400', 'fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2'],
  ['Inter', '500', 'fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2'],
  ['Inter', '600', 'fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2'],
  ['JetBrains Mono', '400', 'fonts/tDbV2o-flEEny0FZhsfKu5WU4xD7OwE.woff2'],
  ['JetBrains Mono', '500', 'fonts/tDbV2o-flEEny0FZhsfKu5WU4xD7OwE.woff2'],
  ['JetBrains Mono', '700', 'fonts/tDbV2o-flEEny0FZhsfKu5WU4xD7OwE.woff2'],
  ['Spectral', '500', 'fonts/rnCs-xNNww_2s0amA9vKsW3BafY.woff2'],
  ['Spectral', '600', 'fonts/rnCs-xNNww_2s0amA9vmtm3BafY.woff2'],
  ['Source Serif Four', '600', 'fonts/vEFF2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf6kDXr4.woff2'],
  ['Source Serif Four', '700', 'fonts/vEFF2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf6kDXr4.woff2'],
  ['Source Serif Four', '900', 'fonts/vEFF2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf6kDXr4.woff2'],
];

if (typeof document !== 'undefined') {
  const handle = delayRender('local fonts', { timeoutInMilliseconds: 120000 });
  // Most are variable fonts (one file covers every weight): register each family+file once,
  // with the weight range it serves, instead of once per weight.
  const unique = new Map<string, { family: string; file: string; weights: number[] }>();
  for (const [family, weight, file] of FILES) {
    const k = family + '|' + file;
    const e = unique.get(k) ?? { family, file, weights: [] };
    e.weights.push(Number(weight));
    unique.set(k, e);
  }
  Promise.all(
    [...unique.values()].map(({ family, file, weights }) => {
      const lo = Math.min(...weights);
      const hi = Math.max(...weights);
      const weight = lo === hi ? String(lo) : `${lo} ${hi}`;
      const face = new FontFace(family, `url(${staticFile(file)}) format('woff2')`, { weight, style: 'normal' });
      (document.fonts as unknown as { add: (f: FontFace) => void }).add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error('font load failed', e);
      continueRender(handle);
    });
}

export const FONT_DISPLAY = 'Space Grotesk';
export const FONT_BODY = 'Inter';
export const FONT_MONO = 'JetBrains Mono';
// serif for the Claude Code wordmark clone (close match to the app's serif)
export const FONT_SERIF = 'Spectral';
// heavy editorial serif for the vox collage engine's headlines
export const FONT_EDITORIAL = 'Source Serif Four';
