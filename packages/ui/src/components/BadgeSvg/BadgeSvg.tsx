import { useMemo } from 'react';

type PartInfo = {
  backgroundColor: string
  color: string
  text: string
}

export interface BadgeSvgProps {
  canvas?: AnyCanvas;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  partPadding: [number, number];
  parts: [PartInfo, PartInfo];
}

const fakeCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : undefined;

export function BadgeSvg ({ partPadding, fontSize, fontWeight, fontFamily, parts, canvas }: BadgeSvgProps) {
  canvas ??= fakeCanvas;

  console.log(document, canvas);

  if (!canvas) {
    throw new Error('Canvas not provided to measure text size');
  }

  const sig = JSON.stringify(parts);

  const sz = useMemo(() => {
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const res = parts.map(p => ctx.measureText(p.text));
    ctx.restore();
    return res as [TextMetrics, TextMetrics];
  }, [fontSize, fontWeight, fontFamily, sig]);

  console.log(sz);

  let tw = sz.map(m => m.width) as [number, number];
  let th = sz.map(m => m.fontBoundingBoxAscent + m.fontBoundingBoxDescent) as [number, number];

  function Part ({ i, offsetX }: { i: number, offsetX: number }) {
    return (
      <g fill="none" fillRule="evenodd">
        <rect
          x={offsetX}
          y={0}
          width={tw[i] + partPadding[0] * 2}
          height={th[i] + partPadding[1] * 2}
          fill={parts[i].backgroundColor}
          strokeWidth={0}
          clipPath="url(#clip)"
        />
        <text
          x={offsetX + tw[i] / 2 + partPadding[0]}
          y={th[i] / 2 + partPadding[1]}
          fill={parts[i].color}
          stroke={parts[i].color}
          strokeWidth={i}
          textAnchor="middle"
          alignmentBaseline="central"
        >
          {parts[i].text}
        </text>
      </g>
    );
  }

  const sw = partPadding[0] * 4 + tw[0] + tw[1];
  const sh = partPadding[1] * 2 + Math.max(th[0], th[1]);

  return (
    <svg
      width={sw}
      height={sh}
    >
      <defs>
        <clipPath id="clip">
          <rect x="0" y="0" width={sw} height={sh} rx={3} />
        </clipPath>
      </defs>
      <g
        fontSize={fontSize}
        fontFamily={fontFamily}
        fontWeight={fontWeight}
      >
        <Part i={0} offsetX={0} />
        <Part i={1} offsetX={tw[0] + partPadding[0] * 2} />
      </g>
    </svg>
  );
}

interface AnyCanvas {
  getContext (d: '2d'): AnyCanvasContext2D;
}

interface AnyCanvasContext2D extends Pick<CanvasRenderingContext2D, 'save' | 'restore' | 'font' | 'fontKerning' | 'textBaseline' | 'textAlign' | 'measureText'> {
}
