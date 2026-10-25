import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import type { Site } from './site';
import './styles.css';

/** Render a builder for one site, applying its editor theme to the whole page. */
export function mount(site: Site) {
  const root = document.documentElement.style;
  Object.entries(site.theme).forEach(([k, v]) => root.setProperty(k, v));
  root.setProperty('--ui-font', site.uiFont);
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App site={site} />
    </StrictMode>,
  );
}
