import { ViteReactSSG } from 'vite-react-ssg';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './App.css';
import { routes } from './routes';

export const createRoot = ViteReactSSG({ routes });
