import '@fontsource/barlow/latin-400.css';
import '@fontsource/barlow/latin-700.css';
import '@fontsource/barlow/latin-800.css';
import '@fontsource/roboto-slab/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import { loadOptionalFont } from './fonts';
import { mount } from './mount';
import { SBR } from './site';

loadOptionalFont('Factoria');
mount(SBR);
