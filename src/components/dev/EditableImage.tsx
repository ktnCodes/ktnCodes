'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { useDevMode } from './useDevMode';

interface EditableImageProps {
  /** Current image src (e.g. "/about/portrait.jpg"). */
  src: string;
  alt: string;
  /**
   * Where the upload should land. Path is relative to project root, e.g.
   * "public/about/portrait.jpg". Existing file is overwritten.
   */
  uploadPath: string;
  width: number;
  height: number;
  className?: string;
}

/**
 * Image with a dev-mode drop zone. Hover shows "drop image to replace".
 * Drop a file → uploads via /api/dev/save → updates the local img src
 * (cache-busted with ?t=) so you see it instantly without a reload.
 *
 * In production: pure <Image>, no drop zone.
 */
export function EditableImage({
  src,
  alt,
  uploadPath,
  width,
  height,
  className = '',
}: EditableImageProps) {
  const dev = useDevMode();
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hover, setHover] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('path', uploadPath);
      fd.append('file', file);
      const res = await fetch('/api/dev/save', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'upload failed');
      // Cache-bust the local <img>
      setCurrentSrc(`${json.url}?t=${Date.now()}`);
    } catch (e) {
      console.error('[EditableImage] upload failed', e);
      alert(`Upload failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) void upload(file);
    setHover(false);
  }

  if (!dev) {
    return (
      <Image src={currentSrc} alt={alt} width={width} height={height} className={className} />
    );
  }

  return (
    <div
      className="relative group"
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={onDrop}
    >
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${hover || uploading ? 'opacity-40' : ''} transition-opacity`}
        unoptimized={currentSrc.includes('?t=')}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        title={`dev-edit: ${uploadPath}`}
        className={`absolute inset-0 flex items-center justify-center text-[11px] font-mono text-white bg-black/60 transition-opacity ${
          hover || uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-90'
        }`}
      >
        {uploading ? 'Uploading...' : hover ? 'Drop to replace' : '✏️ Click or drop image'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
