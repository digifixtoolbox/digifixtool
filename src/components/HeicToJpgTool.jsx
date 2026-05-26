import { useState, useRef, useCallback } from 'react';
import SaveAsDialog from "./SaveAsDialog";
import { iconSvgs } from '../data/iconSvgs.js';

// Lazy-load libheif-js (1.46 MB WASM bundle, only fetched on first conversion)
let _libheifPromise = null;
async function getLibheif() {
  if (!_libheifPromise) {
    _libheifPromise = import('libheif-js/wasm-bundle').then(mod => {
      const exported = mod.default ?? mod;
      return Promise.resolve(exported);
    });
  }
  return _libheifPromise;
}

async function decodeHeicBlob(file) {
  const libheif = await getLibheif();
  if (!libheif || typeof libheif.HeifDecoder !== 'function') {
    throw new Error('libheif not ready');
  }

  const buffer = await file.arrayBuffer();
  const decoder = new libheif.HeifDecoder();
  const images = decoder.decode(new Uint8Array(buffer));

  if (!images || images.length === 0) {
    throw new Error('No images in file');
  }

  const image = images[0];
  const width = image.get_width();
  const height = image.get_height();

  if (!width || !height) throw new Error('Invalid dimensions');

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(width, height);

  await new Promise((resolve, reject) => {
    image.display(imgData, displayData => {
      if (!displayData) return reject(new Error('HEIC decode failed'));
      ctx.putImageData(displayData, 0, 0);
      resolve();
    });
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('JPEG export failed')), 'image/jpeg', 0.9);
  });
}

// Fallback: use browser native decoding (works in Safari which supports HEIC natively)
async function decodeNative(file) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext('2d').drawImage(bitmap, 0, 0);
  bitmap.close();
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Canvas export failed')), 'image/jpeg', 0.9);
  });
}

// Detect mobile/touch device — iPads running iOS 13+ report as Mac with touch points
const isMobile = /iPhone|iPad|iPod|Android/i.test(
  typeof navigator !== 'undefined' ? navigator.userAgent : ''
) || (
  typeof navigator !== 'undefined' &&
  navigator.maxTouchPoints > 1 &&
  !/Mac/.test(navigator.userAgent)
);

// Safari/Firefox fall back to <a download> in saveAs(); isSafari used only for the hint
const isSafari = typeof navigator !== 'undefined' &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Mobile: use share sheet (native iOS/Android experience)
async function saveFileMobile(outputUrl, outputFilename) {
  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      const res = await fetch(outputUrl);
      const blob = await res.blob();
      const file = new File([blob], outputFilename, { type: 'image/jpeg' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: outputFilename });
        return;
      }
    }
  } catch (e) {
    if (e.name === 'AbortError') return;
  }
  const a = document.createElement('a');
  a.href = outputUrl;
  a.download = outputFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Desktop: direct download to Downloads folder
function saveFileDesktop(outputUrl, outputFilename) {
  const a = document.createElement('a');
  a.href = outputUrl;
  a.download = outputFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Desktop: Save As — receives the actual blob so showSaveFilePicker can write it directly
async function saveAs(blob, suggestedName) {
  if (typeof window !== 'undefined' && window.showSaveFilePicker) {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: suggestedName,
        types: [{
          description: 'JPEG Image',
          accept: { 'image/jpeg': ['.jpg', '.jpeg'] },
        }],
      });
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (err) {
      if (err.name === 'AbortError') return; // user cancelled — do nothing
      // fall through to fallback only on real errors
    }
  }
  // Fallback for Safari and Firefox (no showSaveFilePicker support)
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = suggestedName;
  a.click();
  URL.revokeObjectURL(url);
}

function FileRow({ item, onAction, onSave, onSaveAs, showSaveButton }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      background: 'var(--surface-2)',
      border: '1px solid var(--border-light)',
      borderRadius: '14px',
      padding: '12px 16px',
    }}>
      {/* Thumbnail */}
      <div style={{
        width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0,
        background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {item.status === 'done' && item.outputUrl ? (
          <img src={item.outputUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : item.canRender === true && item.previewUrl ? (
          <img src={item.previewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <>
            {item.previewUrl && item.canRender === null && (
              <img
                src={item.previewUrl}
                style={{ display: 'none' }}
                onLoad={() => onAction(item.id, 'setCanRender', true)}
                onError={() => onAction(item.id, 'setCanRender', false)}
                alt=""
              />
            )}
            <span style={{ fontSize: '24px' }}>📷</span>
          </>
        )}
      </div>

      {/* Name + size */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '14px', fontWeight: 600,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: 'var(--text)',
        }}>
          {item.file.name}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
          {(item.file.size / 1024).toFixed(0)} KB
        </div>
      </div>

      {/* Status + per-file save */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {item.status === 'idle' && (
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Queued</span>
        )}
        {item.status === 'converting' && (
          <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>Converting…</span>
        )}
        {item.status === 'done' && item.outputUrl && (
          <>
            <span style={{
              fontSize: '12px', fontWeight: 700, color: '#16a34a',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              ✓ Ready
            </span>
            {showSaveButton && (
              <>
                <button
                  onClick={() => onSave(item)}
                  style={{
                    background: 'var(--upload-btn-bg)', color: 'var(--upload-btn-color)', border: 'none',
                    borderRadius: '99px', padding: '8px 14px',
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    minHeight: '36px', fontFamily: 'inherit',
                  }}
                >
                  Save
                </button>
                {!isMobile && (
                  <button
                    onClick={() => onSaveAs(item)}
                    style={{
                      background: 'transparent', color: 'var(--outline-btn-color)',
                      border: '1px solid var(--outline-btn-color)',
                      borderRadius: '99px', padding: '8px 14px',
                      fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                      minHeight: '36px', fontFamily: 'inherit',
                    }}
                  >
                    Save As…
                  </button>
                )}
              </>
            )}
          </>
        )}
        {item.status === 'error' && (
          <span style={{
            fontSize: '12px', color: '#dc2626',
            maxWidth: '180px', textAlign: 'right', lineHeight: 1.3,
          }}>
            {item.error}
          </span>
        )}
      </div>
    </div>
  );
}

function makeItem(file) {
  return {
    id: Math.random().toString(36).slice(2),
    file,
    previewUrl: URL.createObjectURL(file),
    canRender: null,
    status: 'idle',
    outputUrl: null,
    outputBlob: null,   // store actual blob so Save As can write it directly
    outputFilename: null,
    error: null,
  };
}

var supportsFileShare = (function() {
  try { return typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare && navigator.canShare({ files: [new File([], 't.jpg', { type: 'image/jpeg' })] }); }
  catch(e) { return false; }
})();

export default function HeicToJpgTool() {
  const [items, setItems] = useState([]);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState('');
  const [safariHintVisible, setSafariHintVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [saveAsDialog, setSaveAsDialog] = useState(null);
  const inputRef = useRef(null);
  const urlsRef = useRef([]);
  const hintTimerRef = useRef(null);

  const updateItem = useCallback((id, patch) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, ...patch } : it));
  }, []);

  const handleAction = useCallback((id, action, value) => {
    if (action === 'setCanRender') updateItem(id, { canRender: value });
  }, [updateItem]);

  const runConversions = useCallback(async (newItems) => {
    setConverting(true);
    const total = newItems.length;

    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i];
      setProgress(`Converting ${i + 1} of ${total}…`);
      updateItem(item.id, { status: 'converting' });

      let blob = null;

      try {
        blob = await decodeHeicBlob(item.file);
      } catch (e1) {
        try {
          blob = await decodeNative(item.file);
        } catch (e2) {
          // both paths failed
        }
      }

      if (blob) {
        const outputUrl = URL.createObjectURL(blob);
        urlsRef.current.push(outputUrl);
        const baseName = item.file.name.replace(/\.(heic|heif)$/i, '');
        updateItem(item.id, {
          status: 'done',
          outputUrl,
          outputBlob: blob,   // keep the blob for Save As
          outputFilename: baseName + '.jpg',
        });
      } else {
        updateItem(item.id, {
          status: 'error',
          error: 'Conversion failed. The file may be corrupted or an unsupported format.',
        });
      }
    }

    setProgress('');
    setConverting(false);
  }, [updateItem]);

  const handleFiles = useCallback((fileList) => {
    if (!fileList || fileList.length === 0) return;
    const newItems = Array.from(fileList).map(f => {
      const item = makeItem(f);
      urlsRef.current.push(item.previewUrl);
      if (f.size > 25 * 1024 * 1024) {
        return { ...item, status: 'error', error: `File too large (${(f.size / 1024 / 1024).toFixed(1)}MB). Maximum is 25MB. Pro version coming soon with higher limits.` };
      }
      return item;
    });
    setItems(prev => [...prev, ...newItems]);
    const toConvert = newItems.filter(it => it.status !== 'error');
    if (toConvert.length) runConversions(toConvert);
  }, [runConversions]);

  const handleDrop = useCallback(e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }, [handleFiles]);
  const handleDragOver = useCallback(e => e.preventDefault(), []);
  const handleInputChange = useCallback(e => { handleFiles(e.target.files); e.target.value = ''; }, [handleFiles]);
  const openPicker = useCallback(() => inputRef.current?.click(), []);

  const handleClear = useCallback(() => {
    urlsRef.current.forEach(u => { try { URL.revokeObjectURL(u); } catch {} });
    urlsRef.current = [];
    setItems([]);
    setProgress('');
    setConverting(false);
  }, []);

  // Per-item save (device-aware)
  const handleSaveItem = useCallback((item) => {
    if (isMobile) {
      saveFileMobile(item.outputUrl, item.outputFilename);
    } else {
      saveFileDesktop(item.outputUrl, item.outputFilename);
    }
  }, []);

  const handleSaveItemAs = useCallback((item) => {
    setSaveAsDialog({ blob: item.outputBlob, filename: item.outputFilename });
  }, []);

  function doSaveAsDialog(filename) {
    const url = URL.createObjectURL(saveAsDialog.blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    setSaveAsDialog(null);
  }

  // Bulk save
  const handleSaveAll = useCallback(() => {
    const done = items.filter(it => it.status === 'done' && it.outputUrl);
    if (isMobile) {
      done.forEach(it => saveFileMobile(it.outputUrl, it.outputFilename));
    } else {
      done.forEach(it => saveFileDesktop(it.outputUrl, it.outputFilename));
    }
  }, [items]);

  const handleShareAll = useCallback(async () => {
    const done = items.filter(it => it.status === 'done' && it.outputBlob);
    if (!done.length) return;
    const files = done.map(it => new File([it.outputBlob], it.outputFilename, { type: 'image/jpeg' }));
    if (navigator.share && navigator.canShare && navigator.canShare({ files })) {
      try { await navigator.share({ files, title: 'PixMidas' }); }
      catch(err) { if (err.name !== 'AbortError') { handleSaveAll(); } }
    } else { handleSaveAll(); }
  }, [items, handleSaveAll]);

  const handleSaveAllAs = useCallback(() => {
    const done = items.filter(it => it.status === 'done' && it.outputBlob);
    if (done.length === 1) {
      setSaveAsDialog({ blob: done[0].outputBlob, filename: done[0].outputFilename });
    } else {
      done.forEach(it => saveFileDesktop(it.outputUrl, it.outputFilename));
    }
  }, [items]);

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept=".heic,.heif,image/heic,image/heif,image/*"
      multiple
      style={{ display: 'none' }}
      onChange={handleInputChange}
    />
  );

  // ── Drop zone (empty state) ───────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-light)',
          borderRadius: 20,
          padding: 32,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onClick={openPicker}
            style={{
              border: '2px dashed',
              borderColor: isDragging ? '#2563eb' : 'var(--border)',
              borderRadius: 16,
              padding: '48px 32px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s',
              background: isDragging ? '#eff6ff' : 'var(--surface-2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📷</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, color: 'var(--text)' }}>
              Drop HEIC files here
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 8 }}>
              or click to browse. Convert multiple files at once
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>Maximum per file: 25MB</p>
            <button style={{
              background: 'var(--upload-btn-bg)',
              color: 'var(--upload-btn-color)',
              border: 'none',
              borderRadius: 999,
              padding: '14px 28px',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              Choose Files
            </button>
            {fileInput}
          </div>
        </div>
      </>
    );
  }

  // ── Post-upload state ─────────────────────────────────────────────────────
  const doneItems = items.filter(it => it.status === 'done' && it.outputUrl);
  const allSettled = !converting && items.every(it => it.status === 'done' || it.status === 'error');
  const saveLabel = isMobile
    ? (doneItems.length === 1 ? 'Save JPG' : `Save All ${doneItems.length} JPGs`)
    : (doneItems.length === 1 ? 'Save' : `Save All ${doneItems.length}`);

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 20, padding: 32 }}>
      {/* In-progress banner */}
      {progress && (
        <div style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border-light)',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--accent)',
        }}>
          <span style={{ fontSize: '18px' }}>⏳</span>
          {progress}
        </div>
      )}

      {/* Success banner */}
      {allSettled && doneItems.length > 0 && (
        <div style={{
          background: 'var(--success-bg)',
          border: '1px solid var(--success-border)',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--success)',
        }}>
          <span style={{ fontSize: '18px' }}>✅</span>
          {doneItems.length === 1
            ? '1 file converted — ready to download'
            : `${doneItems.length} files converted — ready to download`}
        </div>
      )}

      {/* File list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        {items.map(item => (
          <FileRow
            key={item.id}
            item={item}
            onAction={handleAction}
            onSave={handleSaveItem}
            onSaveAs={handleSaveItemAs}
            showSaveButton={items.length > 1}
          />
        ))}
      </div>

      {/* Primary actions */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
        {doneItems.length > 0 && (
          <button
            onClick={handleSaveAll}
            style={{
              background: 'var(--upload-btn-bg)', color: 'var(--upload-btn-color)', border: 'none',
              borderRadius: '24px', padding: '9px 24px',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {saveLabel}
          </button>
        )}
        {!isMobile && doneItems.length > 0 && (
          <button
            onClick={handleSaveAllAs}
            style={{
              background: 'transparent', color: 'var(--outline-btn-color)',
              border: '1.5px solid var(--outline-btn-color)',
              borderRadius: '24px', padding: '9px 24px',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Save As…
          </button>
        )}
        {supportsFileShare && doneItems.length > 0 && (
          <button
            onClick={handleShareAll}
            style={{
              background: 'transparent', color: 'var(--outline-btn-color)',
              border: '1.5px solid var(--outline-btn-color)',
              borderRadius: '24px', padding: '9px 24px',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: iconSvgs['share'] }} /> Share
          </button>
        )}
        <button
          onClick={handleClear}
          style={{
            background: 'transparent', color: 'var(--reset-btn-text)',
            border: '1.5px solid var(--reset-btn-color)',
            borderRadius: '24px', padding: '9px 24px',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Reset
        </button>
      </div>

      {/* Safari hint — shown for 6 seconds after clicking Save As on Safari */}
      {safariHintVisible && (
        <p style={{
          textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)',
          margin: '-8px 0 16px', lineHeight: 1.5,
        }}>
          To always choose your save location in Safari, go to Safari &gt; Settings &gt; General and set "File download location" to Ask.
        </p>
      )}

      {/* Secondary: Add More Files */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={openPicker}
          disabled={converting}
          style={{
            background: 'none', color: 'var(--accent)', border: 'none',
            fontSize: '14px', fontWeight: 600, cursor: converting ? 'not-allowed' : 'pointer',
            padding: '8px 12px', fontFamily: 'inherit',
            opacity: converting ? 0.5 : 1,
            textDecoration: 'underline', textUnderlineOffset: '3px',
          }}
        >
          + Add More Files
        </button>
        {fileInput}
      </div>
      {saveAsDialog !== null && <SaveAsDialog defaultName={saveAsDialog.filename} onSave={doSaveAsDialog} onCancel={function() { setSaveAsDialog(null); }} />}
    </div>
  );
}
