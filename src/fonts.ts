// Industry (SI) is loaded only if its files are present in src/fonts/, since they
// aren't committed until the web licence is confirmed. Without them the SI page
// uses a locally installed Industry or falls back to sans-serif.
// The faces go in a <style> tag rather than the FontFace API so html-to-image
// finds and embeds them in exports.
const files = import.meta.glob('./fonts/Industry-*.ttf', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

const WEIGHTS: Record<string, number> = { Light: 300, Book: 400, Medium: 500, Demi: 600, Bold: 700, Black: 900 };

export function loadIndustry() {
  const css = Object.entries(WEIGHTS).map(([name, weight]) => {
    const url = files[`./fonts/Industry-${name}.ttf`];
    const src = [`local('Industry ${name}')`, `local('Industry-${name}')`, ...(url ? [`url('${url}') format('truetype')`] : [])].join(', ');
    return `@font-face { font-family: 'Industry'; src: ${src}; font-weight: ${weight}; font-display: swap; }`;
  }).join('\n');
  const style = document.createElement('style');
  style.dataset.font = 'industry';
  style.textContent = css;
  document.head.appendChild(style);
  return Object.keys(files).length;
}
