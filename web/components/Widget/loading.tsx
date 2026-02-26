import { DynamicOptionsLoadingProps } from 'next/dynamic';
import { Ref } from 'react';
import './chartloader.scss';

export default function Loading ({ ref }: DynamicOptionsLoadingProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center">
      <span className="chart-loader" />
    </div>
  );
}
