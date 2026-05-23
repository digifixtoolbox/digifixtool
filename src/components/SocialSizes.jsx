import React, { useState, useRef, useEffect } from 'react';

const socialData = {
  instagram: {
    name: 'Instagram', icon: '📸',
    formats: [
      { name: 'Portrait Post (Recommended)', w: 1080, h: 1350, ratio: '4:5', tip: 'Meta recommends 4:5 portrait in 2026 for maximum reach.' },
      { name: 'Square Post', w: 1080, h: 1080, ratio: '1:1', tip: 'Best for feed posts' },
      { name: 'Landscape Post', w: 1080, h: 566, ratio: '1.91:1', tip: 'Wide format' },
      { name: 'Story / Reel', w: 1080, h: 1920, ratio: '9:16', tip: 'Full screen vertical' },
      { name: 'Profile Picture', w: 320, h: 320, ratio: '1:1', tip: 'Circular display' },
      { name: 'Highlight Cover', w: 1080, h: 1920, ratio: '9:16', tip: 'Story highlight' }
    ]
  },
  youtube: {
    name: 'YouTube', icon: '▶️',
    formats: [
      { name: 'Thumbnail', w: 1280, h: 720, ratio: '16:9', tip: 'Standard video cover' },
      { name: 'Channel Banner', w: 2560, h: 1440, ratio: '16:9', tip: 'Desktop/TV safe zone' },
      { name: 'Shorts Thumbnail', w: 1080, h: 1920, ratio: '9:16', tip: 'Vertical shorts' },
      { name: 'Profile Picture', w: 800, h: 800, ratio: '1:1', tip: 'Channel icon' }
    ]
  },
  tiktok: {
    name: 'TikTok', icon: '🎵',
    formats: [
      { name: 'Video', w: 1080, h: 1920, ratio: '9:16', tip: 'Full screen vertical' },
      { name: 'Carousel', w: 1080, h: 1920, ratio: '9:16', tip: 'Up to 35 images supported' },
      { name: 'Square Photo Post', w: 1080, h: 1080, ratio: '1:1', tip: 'Photo mode square' },
      { name: 'Profile Photo', w: 400, h: 400, ratio: '1:1', tip: 'User icon' }
    ]
  },
  facebook: {
    name: 'Facebook', icon: '👍',
    formats: [
      { name: 'Feed Post', w: 1200, h: 630, ratio: '1.91:1', tip: 'Horizontal post' },
      { name: 'Cover Photo', w: 820, h: 312, ratio: '2.6:1', tip: 'Page header' },
      { name: 'Story', w: 1080, h: 1920, ratio: '9:16', tip: 'Vertical story' },
      { name: 'Events Cover', w: 1920, h: 1005, ratio: '1.91:1', tip: 'Event page banner' }
    ]
  },
  linkedin: {
    name: 'LinkedIn', icon: '💼',
    formats: [
      { name: 'Profile Photo', w: 400, h: 400, ratio: '1:1', tip: 'Professional headshot' },
      { name: 'Post Image', w: 1200, h: 627, ratio: '1.91:1', tip: 'Standard post' },
      { name: 'Cover Photo', w: 1584, h: 396, ratio: '4:1', tip: 'Personal banner' }
    ]
  },
  twitter: {
    name: 'Twitter / X', icon: '🐦',
    formats: [
      { name: 'Post Image', w: 1200, h: 675, ratio: '16:9', tip: 'Tweet image' },
      { name: 'Header Image', w: 1500, h: 500, ratio: '3:1', tip: 'Profile banner' }
    ]
  },
  pinterest: {
    name: 'Pinterest', icon: '📌',
    formats: [
      { name: 'Pin Image', w: 1000, h: 1500, ratio: '2:3', tip: 'Ideal pin ratio' },
      { name: 'Square Pin', w: 1000, h: 1000, ratio: '1:1', tip: 'Standard square' },
      { name: 'Story Pin', w: 1080, h: 1920, ratio: '9:16', tip: 'Full screen story' },
      { name: 'Profile Picture', w: 165, h: 165, ratio: '1:1', tip: 'Circular display' }
    ]
  },
  snapchat: {
    name: 'Snapchat', icon: '👻',
    formats: [
      { name: 'Story', w: 1080, h: 1920, ratio: '9:16', tip: 'Full screen vertical' },
      { name: 'Spotlight', w: 1080, h: 1920, ratio: '9:16', tip: 'Viral short-form video' },
      { name: 'Profile Picture', w: 320, h: 320, ratio: '1:1', tip: 'Circular display' }
    ]
  },
  threads: {
    name: 'Threads', icon: '🧵',
    formats: [
      { name: 'Feed Post Portrait', w: 1080, h: 1350, ratio: '4:5', tip: 'Maximizes feed space' },
      { name: 'Feed Post Square', w: 1080, h: 1080, ratio: '1:1', tip: 'Standard square post' },
      { name: 'Profile Picture', w: 320, h: 320, ratio: '1:1', tip: 'Circular display' }
    ]
  },
  whatsapp: {
    name: 'WhatsApp', icon: '💬',
    formats: [
      { name: 'Status', w: 1080, h: 1920, ratio: '9:16', tip: 'Full screen vertical' },
      { name: 'Profile Picture', w: 500, h: 500, ratio: '1:1', tip: 'Contact icon' },
      { name: 'Business Cover', w: 1024, h: 512, ratio: '2:1', tip: 'Business profile header' }
    ]
  }
};

export default function SocialSizes() {
  const [platform, setPlatform] = useState('instagram');
  const [activeFormatIdx, setActiveFormatIdx] = useState(0);
  const previewRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ w: 520, h: 340 });

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      setContainerSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const activeFormat = socialData[platform].formats[activeFormatIdx];

  const PAD = 52;
  const maxShapeW = Math.max(containerSize.w - PAD * 2, 20);
  const maxShapeH = Math.max(containerSize.h - PAD * 2, 20);
  const ar = activeFormat.w / activeFormat.h;
  const isWidthBound = ar >= maxShapeW / maxShapeH;
  const shapeW = isWidthBound ? maxShapeW : Math.round(maxShapeH * ar);
  const shapeH = isWidthBound ? Math.round(maxShapeW / ar) : maxShapeH;

  const downloadTemplate = (f) => {
    const canvas = document.createElement('canvas');
    canvas.width = f.w;
    canvas.height = f.h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, f.w, f.h);
    const link = document.createElement('a');
    link.download = `pixmidas-${platform}-${f.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
  };

  return (
    <div className="social-tool">
      <div style={{fontSize:'12px', fontWeight:'700', color:'var(--text-muted)', marginBottom:'12px', textTransform:'uppercase'}}>Select Platform</div>
      <div style={{display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'15px', marginBottom:'25px'}}>
        {Object.entries(socialData).map(([key, data]) => (
          <button
            key={key}
            onClick={() => { setPlatform(key); setActiveFormatIdx(0); }}
            style={{
              padding: '12px 18px', borderRadius: '12px', whiteSpace: 'nowrap', cursor: 'pointer', fontWeight: '600',
              border: platform === key ? '1px solid var(--accent)' : '1px solid var(--border-light)',
              background: platform === key ? 'var(--accent-light)' : 'var(--surface)',
              color: platform === key ? 'var(--accent)' : 'var(--text)'
            }}
          >
            {data.icon} {data.name}
          </button>
        ))}
      </div>

      <div style={{fontSize:'12px', fontWeight:'700', color:'var(--text-muted)', marginBottom:'12px', textTransform:'uppercase'}}>Select Format</div>
      <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap:'10px', marginBottom:'30px'}}>
        {socialData[platform].formats.map((f, idx) => (
          <button
            key={f.name}
            onClick={() => setActiveFormatIdx(idx)}
            style={{
              padding: '12px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
              border: activeFormatIdx === idx ? '2px solid var(--accent)' : '1px solid var(--border-light)',
              background: activeFormatIdx === idx ? 'var(--surface)' : 'var(--surface-2)'
            }}
          >
            <div style={{fontSize:'13px', fontWeight:'700', color:'var(--text)'}}>{f.name}</div>
            <div style={{fontSize:'11px', color:'var(--text-muted)'}}>{f.w} × {f.h}px</div>
          </button>
        ))}
      </div>

      <div style={{background:'var(--surface)', border:'1px solid var(--border-light)', borderRadius:'24px', padding:'40px', textAlign:'center'}}>
        <div style={{fontSize:'14px', color:'var(--accent)', fontWeight:'700', marginBottom:'5px'}}>{activeFormat.w}:{activeFormat.h}</div>
        <h2 style={{fontSize:'28px', fontWeight:'800', margin:'0', color:'var(--text)'}}>{activeFormat.name}</h2>
        <div style={{fontSize:'16px', color:'var(--text-muted)', marginBottom:'25px'}}>{socialData[platform].name}</div>

        <style>{`
          .pm-canvas-bg {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 340px;
            background: var(--surface-2);
            border-radius: 18px;
            margin: 0 0 28px;
            box-shadow: inset 0 2px 8px rgba(0,0,0,0.06);
          }
          @media (max-width: 600px) {
            .pm-canvas-bg { height: 260px; }
          }
        `}</style>
        <div ref={previewRef} className="pm-canvas-bg">
          <div style={{
            width: `${shapeW}px`,
            height: `${shapeH}px`,
            background: '#ffffff',
            border: '1.5px solid var(--border-light)',
            borderRadius: '6px',
            boxShadow: '0 16px 56px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
            transition: 'width 0.25s ease, height 0.25s ease',
          }} />
        </div>

        <div style={{display:'flex', justifyContent:'center', gap:'40px', marginBottom:'30px'}}>
          <div>
            <div style={{fontSize:'11px', fontWeight:'700', color:'var(--text-muted)', textTransform:'uppercase'}}>Width</div>
            <div style={{fontSize:'24px', fontWeight:'800'}}>{activeFormat.w}px</div>
          </div>
          <div>
            <div style={{fontSize:'11px', fontWeight:'700', color:'var(--text-muted)', textTransform:'uppercase'}}>Height</div>
            <div style={{fontSize:'24px', fontWeight:'800'}}>{activeFormat.h}px</div>
          </div>
        </div>

        {activeFormat.tip && (
          <div style={{display:'inline-block', background:'#f0fdf4', color:'#16a34a', padding:'8px 16px', borderRadius:'99px', fontSize:'13px', fontWeight:'600', marginBottom:'25px'}}>
            💡 {activeFormat.tip}
          </div>
        )}

        <button
          onClick={() => downloadTemplate(activeFormat)}
          style={{
            display: 'block', width: '100%', maxWidth: '400px', margin: '0 auto', padding: '18px', borderRadius: '99px',
            border: 'none', background: 'var(--upload-btn-bg)', color: 'var(--upload-btn-color)', fontWeight: '700', cursor: 'pointer'
          }}
        >
          ⬇ Download blank canvas ({activeFormat.w}×{activeFormat.h})
        </button>
      </div>
    </div>
  );
}
