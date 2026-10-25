import { useEffect, useState } from 'react';
import coversLogo from '../assets/tools/covers.svg';
import siLogo from '../assets/tools/si.svg';
import sbrLogo from '../assets/tools/sbr.svg';

// Commercial Editor Tools: pick a brand, then open one of its tools.

type BrandId = 'a' | 'b' | 'c';
const KEY = 'editorTools.brand';

const BRANDS: { id: BrandId; name: string; logo: string; logoH: number }[] = [
  { id: 'a', name: 'Covers', logo: coversLogo, logoH: 30 },
  { id: 'b', name: 'Sports Illustrated', logo: siLogo, logoH: 18 },
  { id: 'c', name: 'Sportsbook Review', logo: sbrLogo, logoH: 26 },
];

// The promo builders live next to this page, so their links are relative.
const LOGO_TOOL = 'https://oliver-clayton.github.io/logo-exporter/';
const SCREENSHOT_TOOL = 'https://jaredworth.github.io/screenshot_builder2/';
const LINKS: Record<BrandId, { logo?: string; promo?: string; mobile?: string }> = {
  a: { logo: LOGO_TOOL, promo: '../', mobile: SCREENSHOT_TOOL },
  b: { logo: LOGO_TOOL, promo: '../si/', mobile: SCREENSHOT_TOOL },
  c: { logo: LOGO_TOOL, promo: '../sbr/', mobile: SCREENSHOT_TOOL },
};

// Draft copy; guide links are placeholders until the documents exist.
const GUIDES = [
  { name: 'Logo usage guide', desc: 'Clear space, sizing and colour rules', type: 'Guide' },
  { name: 'Promo image standards', desc: 'Copy length, legal lines, approved layouts', type: 'Standard' },
  { name: 'Screenshot specs', desc: 'Device frames, crops and export sizes', type: 'Spec' },
  { name: 'Brand standards', desc: 'The full brand book', type: 'PDF' },
];
const SLACK_HREF = '#';

const isBrand = (v: string | null): v is BrandId => v === 'a' || v === 'b' || v === 'c';
const readSaved = (): BrandId | null => {
  try { const v = localStorage.getItem(KEY); return isBrand(v) ? v : null; } catch { return null; }
};

function Swan() {
  return (
    <svg viewBox="0 0 191 136" fill="none" aria-hidden="true" style={{ height: 30, width: 'auto', display: 'block', flex: 'none' }}>
      <path d="M149.311 66.9269C150.17 66.0012 151.02 65.0688 151.872 64.1231C151.969 64.0188 151.845 63.8494 151.715 63.9081C150.812 64.2991 149.916 64.6905 149.019 65.0815C147.817 65.6032 146.615 66.1182 145.42 66.6332C144.647 66.9659 143.873 67.2919 143.107 67.6238C132.791 72.031 122.909 76.0668 113.651 79.64C30.7653 111.633 -2.18644 106.659 151.716 0.411018C151.955 0.247639 151.716 -0.0976839 151.443 0.0263353C-71.2337 103.092 -7.98259 168.065 86.2153 118.133C106.362 106.698 128.106 89.9016 149.312 66.9265L149.311 66.9269Z" fill="#040A1E" />
      <path d="M190.247 25.3757C180.925 31.8889 164.326 31.8889 155.003 25.3757C154.724 25.1804 154.392 25.5127 154.587 25.7927C160.654 34.4774 161.064 49.4792 155.822 59.0309C155.438 59.7283 155.03 60.4067 154.587 61.039C154.393 61.3193 154.724 61.652 155.003 61.456C155.906 60.8233 156.894 60.2759 157.92 59.7672C167.489 55.0207 181.828 55.5751 190.247 61.456C190.527 61.6513 190.858 61.319 190.663 61.039C184.148 51.7157 184.148 35.1097 190.663 25.786C190.858 25.5056 190.526 25.1729 190.247 25.369V25.3757Z" fill="#040A1E" />
    </svg>
  );
}

export default function Tools() {
  const [brand, setBrand] = useState<BrandId | null>(readSaved);
  const pick = (id: BrandId) => {
    setBrand(id);
    try { localStorage.setItem(KEY, id); } catch { /* private mode: pick just isn't remembered */ }
  };

  // Keys 1 / 2 / 3 switch brand, except while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as Element | null)?.closest?.('input,textarea,select')) return;
      const i = ['1', '2', '3'].indexOf(e.key);
      if (i >= 0) pick(BRANDS[i].id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const cur = BRANDS.find(b => b.id === brand);
  const links = cur ? LINKS[cur.id] : {};
  const tools = cur ? [
    { num: '01', kind: 'Generate', name: 'Logo Generator', desc: 'Export partner and brand logo files sized for commercial pages.', href: links.logo },
    { num: '02', kind: 'Edit', name: 'Promo Code Image Editor', desc: 'Update the code, offer and dates on promo artwork.', href: links.promo },
    { num: '03', kind: 'Generate', name: 'Mobile Screenshot Generator', desc: 'Drop app screenshots into approved device frames.', href: links.mobile },
  ] : [];

  return (
    <div className="page">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 'auto' }}>
          <Swan />
          <div>
            <h1>Commercial Editor Tools</h1>
            <p className="label">Pick your brand · open a tool</p>
          </div>
        </div>
        <a href="#help" className="ask">Ask a designer</a>
      </header>

      <main className="main">
        <section className="section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <span className="label">01 · Which brand are you editing for?</span>
            <span className="mono" style={{ fontSize: 10.5, color: '#8b95a3' }}>{cur ? 'Saved for next time' : 'Not chosen yet'}</span>
          </div>
          <div role="radiogroup" aria-label="Brand" className="brands">
            {BRANDS.map((b, i) => {
              const on = b.id === brand;
              return (
                <button key={b.id} role="radio" aria-checked={on} className={'brand' + (on ? ' on' : '')} onClick={() => pick(b.id)}>
                  <span className="key">{i + 1}</span>
                  <span className="info">
                    <span className="logo"><img src={b.logo} alt={b.name} style={{ maxHeight: b.logoH }} /></span>
                    <span className="state">{on ? 'Selected' : 'Select'}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="section">
          <span className="label">02 · What do you need to do?</span>
          {cur ? (
            <div className="tools">
              {tools.map(t => {
                const off = !t.href;
                return (
                  <a key={t.num} href={off ? undefined : t.href} target="_blank" rel="noopener" aria-disabled={off} className={'tool' + (off ? ' off' : '')}>
                    <span className="top"><span className="num">{t.num}</span><span className="kind">{t.kind}</span></span>
                    <span className="body">
                      <span className="name"><i /><i /><i /><i /><span>{t.name}</span></span>
                      <span className="desc">{t.desc}</span>
                    </span>
                    <span className="foot">
                      <span className="who">{off ? cur.name + ' · not available' : cur.name}</span>
                      <span className="cta">{off ? 'Unavailable' : 'Open →'}</span>
                    </span>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="empty">
              <h2>Choose your brand first</h2>
              <p>Each brand has its own set of tools. We’ll remember your pick next time.</p>
            </div>
          )}
        </section>

        <section className="secondary">
          <div className="section">
            <span className="label">Guides &amp; standards{cur ? ' · ' + cur.name : ''}</span>
            <div className="guides">
              {GUIDES.map(g => (
                <a key={g.name} href="#" className="guide">
                  <span className="text"><span className="gname">{g.name}</span><span className="gdesc">{g.desc}</span></span>
                  <span className="type">{g.type}</span>
                </a>
              ))}
            </div>
          </div>
          <div id="help" className="section">
            <span className="label">Stuck?</span>
            <div className="help">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <h2>Contact a designer</h2>
                <p>If a tool can’t do what you need, or an asset doesn’t look right, the commercial design team can help.</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <a href={SLACK_HREF} className="slack">Request on Slack</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>Legend · Commercial Design</span>
        <span>Press 1 · 2 · 3 to switch brand</span>
      </footer>
    </div>
  );
}
