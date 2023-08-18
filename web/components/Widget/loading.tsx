import { DynamicOptionsLoadingProps } from 'next/dynamic';
import './chartloader.scss';

export default function Loading ({}: DynamicOptionsLoadingProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="chart-loader" />
    </div>
  );
}