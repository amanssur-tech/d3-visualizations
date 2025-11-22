// src/utils/export.ts
/**
 * Shared utilities for chart export functionality
 */

export const downloadSVG = (svgElement: SVGSVGElement, filename = 'chart.svg'): void => {
  const serializer = new XMLSerializer();

  let source = serializer.serializeToString(svgElement);

  // Ensure required SVG namespace attributes
  if (!source.includes('xmlns="http://www.w3.org/2000/svg"')) {
    source = source.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.includes('xmlns:xlink="http://www.w3.org/1999/xlink"')) {
    source = source.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const downloadPNG = (
  svgElement: SVGSVGElement,
  width: number,
  height: number,
  filename = 'chart.png'
): void => {
  const serializer = new XMLSerializer();

  let source = serializer.serializeToString(svgElement);

  // Ensure required SVG namespace attributes
  if (!source.includes('xmlns="http://www.w3.org/2000/svg"')) {
    source = source.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.includes('xmlns:xlink="http://www.w3.org/1999/xlink"')) {
    source = source.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();

  const scale = window.devicePixelRatio || 1;
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');

  img.onload = () => {
    if (!ctx) return;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(url); // cleanup the original blob URL

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url2 = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url2;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url2);
    });
  };

  img.onerror = (e) => console.error('Fehler beim Laden des Bildes:', e);
  img.src = url;
};

export const resolveDataPath = (folder: string, file: string): string => {
  return window.location.pathname.includes(`/${folder}/`)
    ? `data/${file}`
    : `${folder}/data/${file}`;
};
