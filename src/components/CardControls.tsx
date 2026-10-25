import type { ChangeEvent } from 'react';
import type { TemplateKey, TemplateState } from '../data/types';
import type { Actions, CardField } from '../model/store';
import type { View } from '../model/view';
import type { Site } from '../site';
import { readImg } from './SharedControls';

/** <input type=color> only accepts #rrggbb; gradients and color-mix() fall back to black, as in the design. */
const hex = (c: string | null | undefined) => (c && /^#[0-9a-f]{6}$/i.test(c) ? c : '#000000');

interface Props { site: Site; k: TemplateKey; s: TemplateState; v: View; a: Actions }

/**
 * Per-graphic fine tuning. Covers: arrow + overlay (Banner + App), ball position, colours,
 * Covers logo, phone screen. SI: colours and the SI logo only. SBR: colours, background
 * overlay, SBR logo, and the arrow controls inside the phone screen section.
 */
export function CardControls({ site, k, s, v, a }: Props) {
  const covers = site.decor === 'balls', sbr = site.arrow === 'curved';
  const num = (field: CardField) => (e: ChangeEvent<HTMLInputElement>) => a.setField(k, field, parseInt(e.target.value, 10) || 0);
  const col = (field: CardField) => (e: ChangeEvent<HTMLInputElement>) => a.setField(k, field, e.target.value);
  const isBannerApp = k === 't3';
  const slider = (label: string, field: CardField, width: number, range = 400) => (
    <label className="slider">
      <span style={{ width }}>{label}</span>
      <input type="range" min={-range} max={range} step={2} value={s[field] as number} onChange={num(field)} />
    </label>
  );
  const toggle = (label: string, on: boolean, onClick: () => void, small = false) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={small ? { fontSize: 11, color: 'var(--body)' } : { fontSize: 13, color: 'var(--body)', fontWeight: 600 }}>{label}</div>
      <button className={'toggle' + (on ? ' on' : '')} role="switch" aria-checked={on} aria-label={label} onClick={onClick}><span /></button>
    </div>
  );

  return (
    <div style={{ fontFamily: 'var(--ui-font)', background: 'var(--panel)', borderTop: '1px solid var(--border)' }}>
      {isBannerApp && covers && (
        <div style={{ padding: '14px 16px' }}>
          <div className="section-title">Arrow &amp; Code Overlay</div>
          <label className="check" style={{ marginBottom: 10 }}>
            <input type="checkbox" checked={s.showOverlay !== false} onChange={a.toggleOverlay} />
            <span>Show arrow + promo code overlay</span>
          </label>
          {v.overlayOn && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label className="slider" style={{ cursor: 'pointer' }}>
                  <input type="checkbox" checked={s.arrowFlipV} onChange={() => a.toggleArrowFlipV(k)} style={{ flex: 'none', margin: 0 }} />Flip vertically
                </label>
                <button className="btn-ghost sm" onClick={a.resetArrow}>Reset</button>
              </div>
              <div style={{ marginBottom: 7 }}>{slider('Arrow X', 'arrowX', 42)}</div>
              {slider('Arrow Y', 'arrowY', 42)}
            </>
          )}
        </div>
      )}

      {covers && (
        <div className="section">
          <div className="section-title">Ball Position</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div className="lbl" style={{ margin: 0 }}>Position</div>
            <button className="btn-ghost sm" onClick={() => a.resetBallPos(k)}>Reset</button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {([['Ball A', 'ballTopDX', 'ballTopDY'], ['Ball B', 'ballBottomDX', 'ballBottomDY']] as const).map(([name, x, y]) => (
              <div key={name} style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>{name}</div>
                <div style={{ marginBottom: 7 }}>{slider('X', x, 10)}</div>
                {slider('Y', y, 10)}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div className="section-title" style={{ margin: 0 }}>Colour Overrides</div>
          <button className="btn-ghost sm" onClick={() => a.resetColors(k)}>Reset to brand</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <label className="swatch"><input type="color" value={hex(v.bg)} onChange={e => a.setAll('bgC', e.target.value)} />Background</label>
          <label className="swatch"><input type="color" value={hex(v.text)} onChange={col('textC')} />Headline</label>
          <label className="swatch"><input type="color" value={hex(v.accent)} onChange={col('accentC')} />Accent</label>
          <label className="swatch"><input type="color" value={hex(v.pillText)} onChange={col('pillTextC')} />Code text</label>
          {site.pill !== 'plain' && <label className="swatch"><input type="color" value={hex(v.pillBg)} onChange={col('pillBgC')} />Code pill</label>}
        </div>
        {site.decor !== 'sport' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <label className="swatch" style={{ flex: 1 }}><input type="color" value={v.ballColorInput} onChange={col('ballColorC')} />{covers ? 'Recolour balls' : 'Background overlay'}</label>
            <button className="btn-ghost sm" style={{ padding: '6px 12px' }} onClick={() => a.setField(k, 'ballColorC', null)}>Original</button>
          </div>
        )}
      </div>

      <div className="section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, color: 'var(--body)', fontWeight: 600 }}>Show {site.footerName} logo</div>
        <button className={'toggle' + (s.showCovers ? ' on' : '')} role="switch" aria-checked={s.showCovers} aria-label={`Show ${site.footerName} logo`} onClick={() => a.toggleCovers(k)}><span /></button>
      </div>

      {isBannerApp && (
        <div className="section">
          <div className="section-title" style={{ marginBottom: 8 }}>Phone Screen</div>
          {sbr && (
            <>
              <div style={{ marginBottom: 12 }}>{toggle('Show arrow', s.showArrow !== false, () => a.toggleArrow(k))}</div>
              {v.overlayOn && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ marginBottom: 7 }}>{slider('X', 'arrowX', 10, 300)}</div>
                  <div style={{ marginBottom: 7 }}>{slider('Y', 'arrowY', 10, 300)}</div>
                  {toggle('Flip arrow vertically', s.arrowFlipV, () => a.toggleArrowFlipV(k), true)}
                </div>
              )}
            </>
          )}
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>The uploaded screenshot sits behind the phone frame and is saved to the current brand.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <label className="btn-upload" style={{ padding: '8px 12px' }}>Upload screen<input type="file" accept="image/*" onChange={e => readImg(e, url => a.uploadScreen(k, url))} /></label>
            <button className="btn-ghost" style={{ padding: '8px 12px' }} onClick={() => a.clearScreen(k)}>Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}
