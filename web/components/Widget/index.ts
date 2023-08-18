import Loading from '@/components/Widget/loading';
import dynamic from 'next/dynamic';
import './style.scss';

const Widget = dynamic(() => import('./Widget'), { ssr: false, loading: Loading });
export default Widget;
export * from './Parameters';
export * from './Preview';
export * from './Filter';
