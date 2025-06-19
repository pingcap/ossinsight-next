'use client';

import Loading from '@/components/Widget/loading';
import dynamic from 'next/dynamic';

export const Widget = dynamic(() => import('./Widget'), { ssr: false, loading: Loading });
