// Commercial fonts whose web licence isn't confirmed yet (Industry for SI,
// Factoria for SBR) are not committed. Each loads only if its files are present
// in src/fonts/; otherwise the page uses a locally installed copy or the CSS
// fallback. The faces go in a <style> tag rather than the FontFace API so
// html-to-image finds and embeds them in exports.
const files = import.meta.glob('./fonts/{Industry,Factoria}-*.{ttf,otf}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

const FAMILIES = {
  Industry: { Light: 300, Book: 400, Medium: 500, Demi: 600, Bold: 700, Black: 900 },
  Factoria: { Bold: 700 },
};

export function loadOptionalFont(family: keyof typeof FAMILIES) {
  const css = Object.entries(FAMILIES[family]).map(([name, weight]) => {
    const file = Object.keys(files).find(f => f.startsWith(`./fonts/${family}-${name}.`));
    const src = [`local('${family} ${name}')`, `local('${family}-${name}')`];
    if (file) src.push(`url('${files[file]}') format('${file.endsWith('.otf') ? 'opentype' : 'truetype'}')`);
    return `@font-face { font-family: '${family}'; src: ${src.join(', ')}; font-weight: ${weight}; font-display: swap; }`;
  }).join('\n');
  const style = document.createElement('style');
  style.dataset.font = family.toLowerCase();
  style.textContent = css;
  document.head.appendChild(style);
}
