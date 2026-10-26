import type { ChangeEvent } from 'react';
import { FORMATS } from '../data/catalog';
import type { TemplateState } from '../data/types';
import type { Actions } from '../model/store';
import type { View } from '../model/view';
import type { Site } from '../site';

/** Read an uploaded image as a blob URL. */
export const readImg = (e: ChangeEvent<HTMLInputElement>, cb: (url: string) => void) => {
  const file = e.target.files?.[0];
  if (file) cb(URL.createObjectURL(file));
  e.target.value = '';
};

interface Props {
  site: Site;
  /** Square template state + view: the shared panel reads from it and writes to all three. */
  s: TemplateState;
  v: View;
  a: Actions;
  books: { id: string; name: string }[];
  /** Ball options (Covers) or sport backgrounds (SI). */
  balls: { id: string; name: string }[];
  showZones: boolean;
  fitWarn: string;
}

/** "All graphics" panel: brand, balls, offer copy, promo code and T&Cs for every template. */
export function SharedControls({ site, s, v, a, books, balls, showZones, fitWarn }: Props) {
  const text = (field: Parameters<Actions['setAll']>[0]) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => a.setAll(field, e.target.value);
  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--accent)' }}>All graphics</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>Edits here apply to {site.templates.length === 2 ? 'both graphics' : 'all three graphics'}</div>
      </div>
      {fitWarn && (
        <div role="alert" style={{ background: '#2a0f10', border: '1px solid #d83a3a', color: '#ff8a8a', borderRadius: 8, padding: '9px 12px', fontSize: 12, fontWeight: 600, marginBottom: 14 }}>
          Text can't fit at minimum size: {fitWarn}. Shorten the copy.
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24 }}>
        {/* Column 1: brand, logo, colour, balls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label className="lbl" htmlFor="brand">Brand</label>
            <select id="brand" className="field" value={s.book} onChange={e => a.changeBook(e.target.value)}>
              {books.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className="lbl">Logo</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <label className="btn-upload">Upload logo<input type="file" accept="image/*" onChange={e => readImg(e, url => a.setAll('logoOv', url))} /></label>
                <button className="btn-ghost" onClick={() => a.setAll('logoOv', null)}>Reset</button>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <label className="lbl" htmlFor="main-colour">Main colour</label>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input id="main-colour" type="color" className="field" value={v.bgInput} onChange={e => a.setAll('bgC', e.target.value)} />
                <button className="btn-ghost" onClick={() => a.setAll('bgC', null)}>Reset</button>
              </div>
            </div>
          </div>
          {site.decor === 'photo' ? (
            <div>
              <label className="lbl" htmlFor="background">Background</label>
              <select id="background" className="field" value={s.ballTop} onChange={text('ballTop')}>
                {balls.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          ) : site.decor === 'sport' ? (
            <>
              <div>
                <label className="lbl" htmlFor="sport">Background</label>
                <select id="sport" className="field" value={s.sport} onChange={text('sport')}>
                  {balls.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <label className="check">
                <input type="checkbox" checked={s.textLogo} onChange={a.toggleTextLogo} style={{ width: 18, height: 18, margin: '3px 3px 3px 4px' }} />
                <span>No Logo (use brand name as text)</span>
              </label>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              {(['ballTop', 'ballBottom'] as const).map((f, i) => (
                <div key={f} style={{ flex: 1 }}>
                  <label className="lbl" htmlFor={f}>Ball {i ? 'B' : 'A'}</label>
                  <select id={f} className="field" value={s[f]} onChange={text(f)}>
                    {balls.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}
          {v.hasHeroAccent && (
            <label className="check">
              <input type="checkbox" checked={s.heroAccentOn} onChange={a.toggleHeroAccent} />
              <span>Brand accent on hero text</span>
            </label>
          )}
        </div>

        {/* Column 2: offer + promo code */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {v.structured ? (
            <>
              <div>
                <span className="lbl">Start from a format</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {FORMATS.map((f, i) => <button key={f.name} className="btn-format" onClick={() => a.applyFormat(i)}>{f.name}</button>)}
                </div>
              </div>
              <div>
                <label className="lbl" htmlFor="eyebrow">Eyebrow (optional)</label>
                <input id="eyebrow" type="text" className="field caps" value={s.eyebrow} onChange={text('eyebrow')} disabled={v.eyeLock} placeholder={v.eyePh} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <label className="lbl" htmlFor="line1">Headline line 1</label>
                  <input id="line1" type="text" className="field caps" value={s.line1} onChange={text('line1')} placeholder="e.g. BET $5" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <label className="lbl" htmlFor="line2">Headline line 2 (optional)</label>
                  <input id="line2" type="text" className="field caps" value={s.line2} onChange={text('line2')} placeholder="e.g. GET $150" />
                </div>
              </div>
              <div>
                <label className="lbl" htmlFor="sub">Sub line (optional)</label>
                <input id="sub" type="text" className="field caps" value={s.sub} onChange={text('sub')} disabled={v.subLock} placeholder={v.subPh} />
              </div>
              <div className="hint">Both headline lines always share one size. Sub line is half that size. Leave a field blank to hide it.</div>
            </>
          ) : (
            <div>
              <label className="lbl" htmlFor="offer">Offer text</label>
              <input id="offer" type="text" className="field" value={s.amount} onChange={e => a.setOfferText(e.target.value)} />
            </div>
          )}
          <label className="check">
            <input type="checkbox" checked={s.showPromo} onChange={a.togglePromo} />
            <span>Use promo code</span>
          </label>
          <label className="check">
            <input type="checkbox" checked={showZones} onChange={a.toggleZones} />
            <span>Show zones <span className="muted">(debug · not exported)</span></span>
          </label>
          {s.showPromo && (
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <label className="lbl" htmlFor="promo-label">Promo label</label>
                <input id="promo-label" type="text" className="field" value={s.promoLabel} onChange={text('promoLabel')} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <label className="lbl" htmlFor="promo-code">Promo code</label>
                <input id="promo-code" type="text" className="field code" value={s.code} onChange={text('code')} />
              </div>
            </div>
          )}
        </div>

        {/* Column 3: T&Cs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {v.structured ? (
            <>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 6, minHeight: 24 }}>
                  <label className="lbl" htmlFor="tcs-brand" style={{ margin: 0 }}>T&amp;Cs {v.tcsEdited ? '(edited for this brand)' : '(brand default)'}</label>
                  {v.tcsEdited && <button type="button" className="btn-ghost sm" aria-label="Reset T&Cs to brand default" title="Reset to brand default" onClick={() => a.setBrandTcs(null)}>Reset</button>}
                </div>
                <textarea id="tcs-brand" className="field brand-tcs" value={v.brandTcs} onChange={e => a.setBrandTcs(e.target.value)} />
              </div>
              <div>
                <label className="lbl" htmlFor="state-note">State note (optional, appended to T&amp;Cs)</label>
                <input id="state-note" type="text" className="field" value={s.stateNote} onChange={text('stateNote')} />
              </div>
            </>
          ) : (
            <div>
              <label className="lbl" htmlFor="tcs">T&amp;Cs text</label>
              <textarea id="tcs" className="field free" value={s.tcs} onChange={text('tcs')} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
