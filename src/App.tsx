import { useLayoutEffect, useRef, useState } from 'react';
import { asset } from './data/assets';
import { ballsFor, bookList, booksFor, CATEGORIES } from './data/catalog';
import { TEMPLATE_KEYS, type TemplateKey } from './data/types';
import { CardControls } from './components/CardControls';
import { PromoCanvas } from './components/PromoCanvas';
import { SharedControls } from './components/SharedControls';
import { LayoutEngine } from './layout/engine';
import { exportZip } from './model/export';
import { logoAspect, recolorBall, useImageCache } from './model/images';
import { useBuilder } from './model/store';
import { computeView } from './model/view';

const CARDS: { key: TemplateKey; title: string; chip: string; size: string; preview: { w: number; h: number; scale: number } }[] = [
  { key: 't1', title: 'Square Post', chip: 'Square', size: '1080 × 1080', preview: { w: 420, h: 420, scale: 420 / 1080 } },
  { key: 't2', title: 'Wide Banner', chip: 'Wide Banner', size: '976 × 549', preview: { w: 420, h: 237, scale: 420 / 1294 } },
  { key: 't3', title: 'Banner + App Screen', chip: 'Banner + App Screen', size: '976 × 549', preview: { w: 420, h: 237, scale: 420 / 1294 } },
];

export default function App() {
  const [st, a] = useBuilder();
  const [fitWarn, setFitWarn] = useState('');
  const [exportSel, setExportSel] = useState<Record<TemplateKey, boolean>>({ t1: true, t2: true, t3: true });
  const [exporting, setExporting] = useState(false);
  useImageCache();

  const roots = useRef<Record<TemplateKey, HTMLDivElement | null>>({ t1: null, t2: null, t3: null });
  const runLayout = useRef<() => void>(() => {});
  const engine = useRef<LayoutEngine>();
  engine.current ||= new LayoutEngine(() => runLayout.current());

  const ctx = { cat: st.cat, showZones: st.showZones, aspect: logoAspect, recolor: recolorBall };
  const views = { t1: computeView('t1', st.t1, ctx), t2: computeView('t2', st.t2, ctx), t3: computeView('t3', st.t3, ctx) };

  // Fit text and place zones on the real DOM after every render.
  runLayout.current = () => {
    const w = engine.current!.run(st.cat, st.showZones, st, roots.current);
    setFitWarn(prev => (prev === w ? prev : w));
  };
  useLayoutEffect(() => runLayout.current());
  useLayoutEffect(() => { document.fonts?.ready.then(() => runLayout.current()); }, []);

  const books = booksFor(st.cat);
  const anySel = TEMPLATE_KEYS.some(k => exportSel[k]);
  const doExport = async () => {
    const items = TEMPLATE_KEYS.filter(k => exportSel[k] && roots.current[k])
      .map(k => ({ key: k, node: roots.current[k]!, brand: books[st[k].book]?.name || 'Brand' }));
    if (!items.length || exporting) return;
    setExporting(true);
    try { await exportZip(items, books[st.t1.book]?.name || 'Brand'); }
    catch (err) { console.error('export failed', err); alert('Export failed. See the console for details.'); }
    finally { setExporting(false); }
  };
  const catName = CATEGORIES.find(c => c.id === st.cat)!.name;
  const balls = ballsFor(st.cat);

  return (
    <div className="app">
      <header style={{ padding: '26px 30px 18px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={asset('assets/covers-icon-orange.svg')} style={{ width: 30, height: 30 }} alt="" />
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: 25, color: '#fff', letterSpacing: '-.01em' }}>Promo Template Builder</h1>
          </div>
          <div style={{ fontSize: 13, color: '#6b7682', marginTop: 7, maxWidth: 680 }}>
            Three ad templates from one set of edits. Pick a brand, swap the ball graphics, edit the copy and fine-tune each graphic. Every change updates live. Export the selected graphics as WebP in one zip.
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#4c5763', letterSpacing: '.04em' }}>COVERS &nbsp;×&nbsp; {catName.toUpperCase()} PROMO</div>
      </header>

      <nav style={{ display: 'flex', gap: 8, padding: '0 30px 10px', flexWrap: 'wrap' }} aria-label="Category">
        {CATEGORIES.map(c => (
          <button key={c.id} className={'chip' + (c.id === st.cat ? ' on' : '')} aria-pressed={c.id === st.cat} style={{ padding: '9px 20px', fontSize: 13 }} onClick={() => a.switchCat(c.id)}>{c.name}</button>
        ))}
      </nav>

      <div style={{ padding: '8px 30px 4px' }}>
        <SharedControls s={st.t1} v={views.t1} a={a} books={bookList(st.cat)} balls={Object.keys(balls).map(id => ({ id, name: balls[id].name }))} showZones={st.showZones} fitWarn={fitWarn} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 30px 0', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: '#8a93a0', fontWeight: 600 }}>Export</span>
        {CARDS.map(({ key, chip }) => {
          const on = exportSel[key];
          return (
            <button key={key} aria-pressed={on} onClick={() => setExportSel(s => ({ ...s, [key]: !s[key] }))} style={{
              display: 'flex', alignItems: 'center', gap: 8, background: on ? '#1c130e' : '#0e1318', color: on ? '#ffd9c6' : '#8a93a0',
              border: `1px solid ${on ? '#FD5000' : '#2a3542'}`, borderRadius: 999, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, border: `1.5px solid ${on ? '#FD5000' : '#2a3542'}`, background: on ? '#FD5000' : 'transparent', color: '#fff', fontSize: 10, lineHeight: '11px', textAlign: 'center' }}>{on ? '✓' : ''}</span>
              {chip}
            </button>
          );
        })}
        <button onClick={doExport} disabled={!anySel || exporting} style={{ background: '#FD5000', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 12, fontWeight: 700, cursor: anySel ? 'pointer' : 'default', fontFamily: "'Inter', sans-serif", opacity: anySel ? 1 : 0.4 }}>
          {exporting ? 'Exporting…' : 'Export selected (.zip)'}
        </button>
      </div>

      <main style={{ display: 'flex', gap: 24, padding: '8px 30px 48px', overflowX: 'auto', alignItems: 'flex-start' }}>
        {CARDS.map(({ key, title, size, preview }) => (
          <section key={key} className="card" aria-label={title}>
            <div style={{ padding: '15px 16px', borderBottom: '1px solid #1b2530' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#e8edf2' }}>{title}</div>
              <div style={{ fontSize: 11, color: '#5f6b78', marginTop: 2 }}>{size}</div>
            </div>
            <div style={{ padding: 16, background: '#06080a', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: key === 't1' ? undefined : 269 }}>
              <div style={{ width: preview.w, height: preview.h, overflow: 'hidden', borderRadius: 8, position: 'relative', boxShadow: '0 6px 24px rgba(0,0,0,.5)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, transform: `scale(${preview.scale})`, transformOrigin: 'top left' }}>
                  <PromoCanvas ref={el => { roots.current[key] = el; }} fmt={key} v={views[key]} />
                </div>
              </div>
            </div>
            <CardControls k={key} s={st[key]} v={views[key]} a={a} />
          </section>
        ))}
      </main>
    </div>
  );
}
