import React, { useState, useRef, useEffect } from 'react';
import SaveAsDialog from './SaveAsDialog';
import { IconId, IconShare } from '@tabler/icons-react';

var supportsFileShare = (function() {
  try { return typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare && navigator.canShare({ files: [new File([], 't.jpg', { type: 'image/jpeg' })] }); }
  catch(e) { return false; }
})();

const STANDARDS = {
  us:  { name: 'USA',          region: 'Americas',           width: 2,  height: 2,  unit: 'in', pxW: 600, pxH: 600 },
  ca:  { name: 'Canada',       region: 'Americas',           width: 50, height: 70, unit: 'mm', pxW: 591, pxH: 827 },
  br:  { name: 'Brazil',       region: 'Americas',           width: 30, height: 40, unit: 'mm', pxW: 354, pxH: 472 },
  mx:  { name: 'Mexico',       region: 'Americas',           width: 35, height: 45, unit: 'mm', pxW: 413, pxH: 531 },
  eu:  { name: 'EU Standard',  region: 'Europe',             width: 35, height: 45, unit: 'mm', pxW: 413, pxH: 531 },
  uk:  { name: 'UK',           region: 'Europe',             width: 35, height: 45, unit: 'mm', pxW: 413, pxH: 531 },
  de:  { name: 'Germany',      region: 'Europe',             width: 35, height: 45, unit: 'mm', pxW: 413, pxH: 531 },
  fr:  { name: 'France',       region: 'Europe',             width: 35, height: 45, unit: 'mm', pxW: 413, pxH: 531 },
  pt:  { name: 'Portugal',     region: 'Europe',             width: 35, height: 45, unit: 'mm', pxW: 413, pxH: 531 },
  es:  { name: 'Spain',        region: 'Europe',             width: 35, height: 45, unit: 'mm', pxW: 413, pxH: 531 },
  it:  { name: 'Italy',        region: 'Europe',             width: 35, height: 45, unit: 'mm', pxW: 413, pxH: 531 },
  ch:  { name: 'Switzerland',  region: 'Europe',             width: 35, height: 45, unit: 'mm', pxW: 413, pxH: 531 },
  nl:  { name: 'Netherlands',  region: 'Europe',             width: 35, height: 45, unit: 'mm', pxW: 413, pxH: 531 },
  ind: { name: 'India',        region: 'Asia & Middle East', width: 35, height: 45, unit: 'mm', pxW: 413, pxH: 531 },
  cn:  { name: 'China',        region: 'Asia & Middle East', width: 33, height: 48, unit: 'mm', pxW: 390, pxH: 567 },
  jp:  { name: 'Japan',        region: 'Asia & Middle East', width: 35, height: 45, unit: 'mm', pxW: 413, pxH: 531 },
  kr:  { name: 'South Korea',  region: 'Asia & Middle East', width: 35, height: 45, unit: 'mm', pxW: 413, pxH: 531 },
  ae:  { name: 'UAE',          region: 'Asia & Middle East', width: 40, height: 60, unit: 'mm', pxW: 472, pxH: 709 },
  sa:  { name: 'Saudi Arabia', region: 'Asia & Middle East', width: 40, height: 60, unit: 'mm', pxW: 472, pxH: 709 },
  au:  { name: 'Australia',    region: 'Oceania',            width: 35, height: 45, unit: 'mm', pxW: 413, pxH: 531 },
  nz:  { name: 'New Zealand',  region: 'Oceania',            width: 35, height: 45, unit: 'mm', pxW: 413, pxH: 531 },
};

const REGIONS = ['Americas', 'Europe', 'Asia & Middle East', 'Oceania'];
const FRAME_W = 240;
const SHEET_W = 1200;
const SHEET_H = 1800;

export default function PassportPhotoTool() {
  const [phase, setPhase] = useState('upload'); // 'upload' | 'crop' | 'done'
  const [imageEl, setImageEl] = useState(null);
  const [standard, setStandard] = useState('us');
  const [isDrop, setIsDrop] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [userScale, setUserScale] = useState(1.0);
  const [sheetDataUrl, setSheetDataUrl] = useState(null);
  const [saveAsName, setSaveAsName] = useState(null);
  const [error, setError] = useState("");

  const frameRef = useRef(null);
  // Refs mirror state so native event handlers always read latest values
  const offsetRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1.0);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, startOX: 0, startOY: 0 });
  const pinchRef = useRef({ active: false, lastDist: 0 });

  const std = STANDARDS[standard];
  const frameH = Math.round(FRAME_W * std.pxH / std.pxW);

  // Reset position whenever the standard changes
  useEffect(() => {
    setOffset({ x: 0, y: 0 });
    offsetRef.current = { x: 0, y: 0 };
    setUserScale(1.0);
    scaleRef.current = 1.0;
    setPhase((p) => (p === 'done' ? 'crop' : p));
  }, [standard]);

  // Attach non-passive touch + wheel listeners to the crop frame
  useEffect(() => {
    const el = frameRef.current;
    if (!el || phase !== 'crop') return;

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        dragRef.current = {
          active: true,
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          startOX: offsetRef.current.x,
          startOY: offsetRef.current.y,
        };
        pinchRef.current.active = false;
      } else if (e.touches.length === 2) {
        dragRef.current.active = false;
        const d = Math.hypot(
          e.touches[1].clientX - e.touches[0].clientX,
          e.touches[1].clientY - e.touches[0].clientY
        );
        pinchRef.current = { active: true, lastDist: d };
        e.preventDefault();
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 1 && dragRef.current.active) {
        e.preventDefault();
        const next = {
          x: dragRef.current.startOX + (e.touches[0].clientX - dragRef.current.startX),
          y: dragRef.current.startOY + (e.touches[0].clientY - dragRef.current.startY),
        };
        offsetRef.current = next;
        setOffset({ ...next });
      } else if (e.touches.length === 2 && pinchRef.current.active) {
        e.preventDefault();
        const d = Math.hypot(
          e.touches[1].clientX - e.touches[0].clientX,
          e.touches[1].clientY - e.touches[0].clientY
        );
        const next = Math.min(Math.max(scaleRef.current * (d / pinchRef.current.lastDist), 0.5), 5);
        pinchRef.current.lastDist = d;
        scaleRef.current = next;
        setUserScale(next);
      }
    };

    const onTouchEnd = () => {
      dragRef.current.active = false;
      pinchRef.current.active = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      const next = Math.min(Math.max(scaleRef.current * (1 - e.deltaY * 0.001), 0.5), 5);
      scaleRef.current = next;
      setUserScale(next);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('wheel', onWheel);
    };
  }, [phase]);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) { setError('Please upload a valid image file.'); return; }
    if (file.size > 50 * 1024 * 1024) { setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 50MB. Pro version coming soon with higher limits.`); return; }
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageEl(img);
        setOffset({ x: 0, y: 0 });
        offsetRef.current = { x: 0, y: 0 };
        setUserScale(1.0);
        scaleRef.current = 1.0;
        setPhase('crop');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Mouse drag (React synthetic events are fine here)
  const onMouseDown = (e) => {
    e.preventDefault();
    dragRef.current = {
      active: true,
      startX: e.clientX, startY: e.clientY,
      startOX: offsetRef.current.x, startOY: offsetRef.current.y,
    };
  };
  const onMouseMove = (e) => {
    if (!dragRef.current.active) return;
    const next = {
      x: dragRef.current.startOX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.startOY + (e.clientY - dragRef.current.startY),
    };
    offsetRef.current = next;
    setOffset({ ...next });
  };
  const stopDrag = () => { dragRef.current.active = false; };

  const zoomBy = (factor) => {
    const next = Math.min(Math.max(scaleRef.current * factor, 0.5), 5);
    scaleRef.current = next;
    setUserScale(next);
  };

  const applyAndGenerate = () => {
    if (!imageEl) return;
    // Use refs for latest drag/zoom values (avoids stale-closure issues)
    const curScale = scaleRef.current;
    const curOffset = offsetRef.current;
    const baseScale = Math.max(FRAME_W / imageEl.naturalWidth, frameH / imageEl.naturalHeight);
    const imgW = imageEl.naturalWidth * baseScale * curScale;
    const imgH = imageEl.naturalHeight * baseScale * curScale;
    const imgLeft = (FRAME_W - imgW) / 2 + curOffset.x;
    const imgTop = (frameH - imgH) / 2 + curOffset.y;
    const d2c = std.pxW / FRAME_W;

    // Single passport photo
    const photoCanvas = document.createElement('canvas');
    photoCanvas.width = std.pxW;
    photoCanvas.height = std.pxH;
    const pCtx = photoCanvas.getContext('2d');
    pCtx.fillStyle = 'white';
    pCtx.fillRect(0, 0, std.pxW, std.pxH);
    pCtx.drawImage(imageEl, imgLeft * d2c, imgTop * d2c, imgW * d2c, imgH * d2c);

    // Tile onto 4×6 inch sheet
    const cols = Math.max(1, Math.floor(SHEET_W / std.pxW));
    const rows = Math.max(1, Math.floor(SHEET_H / std.pxH));
    const sheet = document.createElement('canvas');
    sheet.width = cols * std.pxW;
    sheet.height = rows * std.pxH;
    const ctx = sheet.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, sheet.width, sheet.height);
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        ctx.drawImage(photoCanvas, c * std.pxW, r * std.pxH);

    setSheetDataUrl(sheet.toDataURL('image/jpeg', 0.95));
    setPhase('done');
  };

  const handleSave = () => {
    const link = document.createElement('a');
    link.download = `passport-${standard}-sheet.jpg`;
    link.href = sheetDataUrl;
    link.click();
  };

  const handleSaveAs = async () => {
    const filename = `passport-${standard}-sheet.jpg`;
    if (typeof window.showSaveFilePicker === 'function') {
      try {
        const handle = await window.showSaveFilePicker({ suggestedName: filename, types: [{ description: 'JPEG Image', accept: { 'image/jpeg': ['.jpg'] } }] });
        const blob = await fetch(sheetDataUrl).then(r => r.blob());
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch(e) {
        if (e.name === 'AbortError') return;
      }
    }
    setSaveAsName(filename);
  };

  const doSaveAs = (filename) => {
    const a = document.createElement('a');
    a.href = sheetDataUrl;
    a.download = filename; a.click();
    setSaveAsName(null);
  };

  const handleShare = async () => {
    if (!sheetDataUrl) return;
    const blob = await fetch(sheetDataUrl).then(r => r.blob());
    const file = new File([blob], `passport-${standard}-sheet.jpg`, { type: 'image/jpeg' });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'PixMidas' }); }
      catch(err) { if (err.name !== 'AbortError') { handleSave(); } }
    } else { handleSave(); }
  };

  const saveBtn = { background: 'var(--upload-btn-bg)', color: 'var(--upload-btn-color)', border: 'none', borderRadius: '24px', padding: '9px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' };
  const saveAsBtn = { background: 'transparent', color: 'var(--outline-btn-color)', border: '1.5px solid var(--outline-btn-color)', borderRadius: '24px', padding: '9px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' };
  const shareBtn = { background: 'transparent', color: 'var(--outline-btn-color)', border: '1.5px solid var(--outline-btn-color)', borderRadius: '24px', padding: '9px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' };
  const resetBtn = { background: 'transparent', color: 'var(--reset-btn-text)', border: '1.5px solid var(--reset-btn-color)', borderRadius: '24px', padding: '9px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' };

  const resetAll = () => {
    setImageEl(null);
    setSheetDataUrl(null);
    setOffset({ x: 0, y: 0 });
    offsetRef.current = { x: 0, y: 0 };
    setUserScale(1.0);
    scaleRef.current = 1.0;
    setPhase('upload');
  };

  // Derived display values used in crop phase render
  const baseScale = imageEl ? Math.max(FRAME_W / imageEl.naturalWidth, frameH / imageEl.naturalHeight) : 1;
  const imgW = imageEl ? imageEl.naturalWidth * baseScale * userScale : 0;
  const imgH = imageEl ? imageEl.naturalHeight * baseScale * userScale : 0;
  const imgLeft = (FRAME_W - imgW) / 2 + offset.x;
  const imgTop = (frameH - imgH) / 2 + offset.y;
  const cols = Math.max(1, Math.floor(SHEET_W / std.pxW));
  const rows = Math.max(1, Math.floor(SHEET_H / std.pxH));

  // ── Upload phase ──────────────────────────────────────────────────────────
  if (phase === 'upload') {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 20, padding: 32 }}>
      <div
        className={`drop-zone ${isDrop ? 'dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDrop(true); }}
        onDragLeave={() => setIsDrop(false)}
        onDrop={(e) => { e.preventDefault(); setIsDrop(false); processFile(e.dataTransfer.files[0]); }}
        onClick={() => document.getElementById('pass-input').click()}
        style={{
          cursor: 'pointer',
          border: isDrop ? '2px solid var(--upload-btn-bg)' : '2px dashed var(--border)',
          backgroundColor: isDrop ? 'var(--accent-light)' : 'var(--surface-2)',
          borderRadius: '16px',
          padding: '56px 24px',
          textAlign: 'center',
          transition: 'all 0.2s',
        }}
      >
        <input type="file" id="pass-input" hidden onChange={(e) => processFile(e.target.files[0])} accept="image/*" />
        <div>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '10px' }}><IconId size={48} color="#E07B10" stroke={2} /></span>
          <p style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>Drop your portrait here or <strong>browse</strong></p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Maximum file size: 50MB</p>
          {error && <p style={{ color: '#dc2626', fontSize: '14px', marginBottom: '8px' }}>{error}</p>}
        </div>
      </div>
      </div>
    );
  }

  // ── Crop phase ────────────────────────────────────────────────────────────
  if (phase === 'crop') {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Country selector */}
        <div>
          <label style={{ fontWeight: 700, display: 'block', marginBottom: 8, fontSize: 14, color: 'var(--text)' }}>
            Country Standard
          </label>
          <select
            value={standard}
            onChange={(e) => setStandard(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, appearance: 'none' }}
          >
            {REGIONS.map((region) => (
              <optgroup key={region} label={region}>
                {Object.entries(STANDARDS)
                  .filter(([, s]) => s.region === region)
                  .map(([id, s]) => (
                    <option key={id} value={id}>
                      {s.name} ({s.width}×{s.height}{s.unit})
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Crop frame */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div
            ref={frameRef}
            style={{
              width: FRAME_W,
              height: frameH,
              overflow: 'hidden',
              position: 'relative',
              cursor: 'grab',
              border: '2px solid var(--upload-btn-bg)',
              boxShadow: '0 0 0 4px rgba(0,113,227,0.12)',
              borderRadius: 6,
              touchAction: 'none',
              userSelect: 'none',
              flexShrink: 0,
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
          >
            {imageEl && (
              <img
                src={imageEl.src}
                alt="crop preview"
                draggable={false}
                style={{
                  position: 'absolute',
                  left: imgLeft,
                  top: imgTop,
                  width: imgW,
                  height: imgH,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              />
            )}
            {/* Biometric guide overlay */}
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
              viewBox={`0 0 ${FRAME_W} ${frameH}`}
            >
              <rect
                x={FRAME_W * 0.2} y={frameH * 0.08}
                width={FRAME_W * 0.6} height={frameH * 0.72}
                fill="none"
                stroke="rgba(0,113,227,0.55)"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
            </svg>
          </div>

          {/* Zoom controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => zoomBy(1 / 1.15)} type="button"
              style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, fontFamily: 'inherit' }}
            >−</button>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', width: 52, textAlign: 'center' }}>
              {Math.round(userScale * 100)}%
            </span>
            <button
              onClick={() => zoomBy(1.15)} type="button"
              style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, fontFamily: 'inherit' }}
            >+</button>
          </div>

          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, textAlign: 'center' }}>
            Drag to reposition · Scroll or pinch to zoom
          </p>
        </div>

        <button
          onClick={applyAndGenerate}
          style={{ padding: '15px', background: 'var(--upload-btn-bg)', color: 'var(--upload-btn-color)', border: 'none', borderRadius: '99px', fontWeight: '700', fontSize: 15, cursor: 'pointer', width: '100%' }}
        >
          Apply &amp; Generate Sheet
        </button>

        <button
          onClick={resetAll}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}
        >
          ← Upload a different photo
        </button>
      </div>
    );
  }

  // ── Done phase ────────────────────────────────────────────────────────────
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      {sheetDataUrl && (
        <img
          src={sheetDataUrl}
          alt="passport photo sheet"
          style={{ maxWidth: '100%', height: 'auto', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
        />
      )}
      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, textAlign: 'center' }}>
        {cols}×{rows} copies · {std.name} ({std.width}×{std.height}{std.unit})
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={handleSave} style={saveBtn}>Save</button>
        <button onClick={handleSaveAs} style={saveAsBtn}>Save As...</button>
        {supportsFileShare && <button onClick={handleShare} style={shareBtn}><IconShare size={16} stroke={2} /> Share</button>}
        <button onClick={resetAll} style={resetBtn}>Reset</button>
      </div>
      <button
        onClick={() => setPhase('crop')}
        style={{ background: 'none', border: '1px solid var(--border-light)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, padding: '8px 18px', borderRadius: 8, fontFamily: 'inherit' }}
      >
        ← Edit position
      </button>
      {saveAsName !== null && <SaveAsDialog defaultName={saveAsName} onSave={doSaveAs} onCancel={function() { setSaveAsName(null); }} />}
    </div>
  );
}
