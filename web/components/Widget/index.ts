import dynamic from 'next/dynamic';
import './style.scss';

const Widget = dynamic(() => import('./Widget'), { ssr: false });
export default Widget;
export * from './Parameters';
export * from './Preview';
export * from './Filter';
