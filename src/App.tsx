import { useLayoutEffect, useRef, useState } from 'react';
import { asset } from './data/assets';
import { ballsFor, bookList, booksFor, CATEGORIES } from './data/catalog';
import type { TemplateKey } from './data/types';
import { CardControls } from './components/CardControls';
import { PromoCanvas } from './components/PromoCanvas';
import { SharedControls } from './components/SharedControls';
import { LayoutEngine } from './layout/engine';
import { exportZip } from './model/export';
import { logoAspect, recolorBall, sportBackground, tintPhoto, useImageCache } from './model/images';
import { useBuilder } from './model/store';
import { computeView } from './model/view';
import { SBR_BACKGROUNDS, SPORTS, type Site } from './site';

const CARDS: { key: TemplateKey; title: string; chip: string; size: string; preview: { w: number; h: number; scale: number } }[] = [
  { key: 't1', title: 'Square Post', chip: 'Square', size: '1080 × 1080', preview: { w: 420, h: 420, scale: 420 / 1080 } },
  { key: 't2', title: 'Wide Banner', chip: 'Wide Banner', size: '976 × 549', preview: { w: 420, h: 237, scale: 420 / 1294 } },
  { key: 't3', title: 'Banner + App Screen', chip: 'Banner + App Screen', size: '976 × 549', preview: { w: 420, h: 237, scale: 420 / 1294 } },
];

export default function App({ site }: { site: Site }) {
  const [st, a] = useBuilder(site);
  const [fitWarn, setFitWarn] = useState('');
  const [exportSel, setExportSel] = useState<Record<TemplateKey, boolean>>({ t1: true, t2: true, t3: true });
  const [exporting, setExporting] = useState(false);
  useImageCache();

  const roots = useRef<Record<TemplateKey, HTMLDivElement | null>>({ t1: null, t2: null, t3: null });
  const runLayout = useRef<() => void>(() => {});
  const engine = useRef<LayoutEngine>();
  engine.current ||= new LayoutEngine(site, () => runLayout.current());

  const ctx = { site, cat: st.cat, showZones: st.showZones, aspect: logoAspect, recolor: recolorBall, sportBg: sportBackground, tintPhoto };
  const views = { t1: computeView('t1', st.t1, ctx), t2: computeView('t2', st.t2, ctx), t3: computeView('t3', st.t3, ctx) };

  // Fit text and place zones on the real DOM after every render.
  runLayout.current = () => {
    const w = engine.current!.run(st.cat, st.showZones, st, roots.current);
    setFitWarn(prev => (prev === w ? prev : w));
  };
  useLayoutEffect(() => runLayout.current());
  // Re-fit once web fonts arrive (late-loading faces such as Barlow or Factoria change every measurement).
  useLayoutEffect(() => {
    const re = () => runLayout.current();
    document.fonts?.ready.then(re);
    document.fonts?.addEventListener('loadingdone', re);
    const timers = [300, 1000, 2500].map(ms => setTimeout(re, ms));
    return () => { document.fonts?.removeEventListener('loadingdone', re); timers.forEach(clearTimeout); };
  }, []);

  const books = booksFor(site, st.cat);
  const cards = CARDS.filter(c => site.templates.includes(c.key));
  const anySel = site.templates.some(k => exportSel[k]);
  const doExport = async () => {
    const items = site.templates.filter(k => exportSel[k] && roots.current[k])
      .map(k => ({ key: k, node: roots.current[k]!, brand: books[st[k].book]?.name || 'Brand' }));
    if (!items.length || exporting) return;
    setExporting(true);
    try { await exportZip(items, books[st.t1.book]?.name || 'Brand'); }
    catch (err) { console.error('export failed', err); alert('Export failed. See the console for details.'); }
    finally { setExporting(false); }
  };
  const catName = CATEGORIES.find(c => c.id === st.cat)!.name;
  const balls = ballsFor(st.cat);
  // SI and SBR swap the Ball A/B pickers for a single background picker.
  const decorOptions = site.decor === 'sport' ? SPORTS : site.decor === 'photo' ? SBR_BACKGROUNDS : Object.keys(balls).map(id => ({ id, name: balls[id].name }));

  return (
    <div className="app">
      <header style={{ padding: '26px 30px 18px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={asset(site.header.icon)} style={site.header.iconStyle} alt="" />
            <h1 style={{ margin: 0, fontFamily: site.header.titleFont, fontWeight: 700, fontSize: 25, color: '#fff', letterSpacing: site.header.titleSpacing }}>Promo Template Builder</h1>
          </div>
          <div style={{ fontSize: 13, color: 'var(--hint)', marginTop: 7, maxWidth: 680 }}>{site.intro}</div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--tag)', letterSpacing: '.04em', fontFamily: site.monoFont }}>{site.label} &nbsp;×&nbsp; {catName.toUpperCase()} PROMO</div>
      </header>

      <nav style={{ display: 'flex', gap: 8, padding: '0 30px 10px', flexWrap: 'wrap' }} aria-label="Category">
        {CATEGORIES.filter(c => site.categories.includes(c.id)).map(c => (
          <button key={c.id} className={'chip' + (c.id === st.cat ? ' on' : '')} aria-pressed={c.id === st.cat} style={{ padding: '9px 20px', fontSize: 13 }} onClick={() => a.switchCat(c.id)}>{c.name}</button>
        ))}
      </nav>

      <div style={{ padding: '8px 30px 4px' }}>
        <SharedControls site={site} s={st.t1} v={views.t1} a={a} books={bookList(site, st.cat)} balls={decorOptions} showZones={st.showZones} fitWarn={fitWarn} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 30px 0', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', fontWeight: 600 }}>Export</span>
        {cards.map(({ key, chip }) => {
          const on = exportSel[key];
          return (
            <button key={key} aria-pressed={on} onClick={() => setExportSel(s => ({ ...s, [key]: !s[key] }))} style={{
              display: 'flex', alignItems: 'center', gap: 8, background: on ? 'var(--chip-on-bg)' : 'var(--panel)', color: on ? 'var(--chip-on-text)' : 'var(--muted)',
              border: `1px solid ${on ? 'var(--accent)' : 'var(--chip-off-border)'}`, borderRadius: 999, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--ui-font)',
            }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, border: `1.5px solid ${on ? 'var(--accent)' : 'var(--chip-off-border)'}`, background: on ? 'var(--accent)' : 'transparent', color: '#fff', fontSize: 10, lineHeight: '11px', textAlign: 'center' }}>{on ? '✓' : ''}</span>
              {chip}
            </button>
          );
        })}
        <button onClick={doExport} disabled={!anySel || exporting} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 12, fontWeight: 700, cursor: anySel ? 'pointer' : 'default', fontFamily: 'var(--ui-font)', opacity: anySel ? 1 : 0.4 }}>
          {exporting ? 'Exporting…' : 'Export selected (.zip)'}
        </button>
      </div>

      <main style={{ display: 'flex', gap: 24, padding: '8px 30px 48px', overflowX: 'auto', alignItems: 'flex-start' }}>
        {cards.map(({ key, title, size, preview }) => (
          <section key={key} className="card" aria-label={title}>
            <div style={{ padding: '15px 16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{title}</div>
              <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 2, fontFamily: site.monoFont }}>{size}</div>
            </div>
            <div style={{ padding: 16, background: 'var(--preview)', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: key === 't1' ? undefined : 269 }}>
              <div style={{ width: preview.w, height: preview.h, overflow: 'hidden', borderRadius: 8, position: 'relative', boxShadow: '0 6px 24px rgba(0,0,0,.5)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, transform: `scale(${preview.scale})`, transformOrigin: 'top left' }}>
                  <PromoCanvas ref={el => { roots.current[key] = el; }} fmt={key} v={views[key]} />
                </div>
              </div>
            </div>
            <CardControls site={site} k={key} s={st[key]} v={views[key]} a={a} />
          </section>
        ))}
      </main>
    </div>
  );
}
