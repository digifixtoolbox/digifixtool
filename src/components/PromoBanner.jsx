import { useState, useEffect, useRef } from "react";
import { BANNER_TOOLS, categoryColor } from "../data/bannerTools.js";
import { iconMap } from '../data/tablerIconMap.js';

const paletteColors = {
  purple: '#5746AF',
  blue:   '#1A6EBF',
  coral:  '#C44B20',
  green:  '#0D7A5A',
  amber:  '#A06010',
  pink:   '#A0306A',
};

export default function PromoBanner({ excludeSlug }) {
  const [tools] = useState(function () {
    return excludeSlug
      ? BANNER_TOOLS.filter(function (t) { return t.slug !== excludeSlug; })
      : BANNER_TOOLS;
  });

  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef(null);

  useEffect(function () {
    setIdx(Math.floor(Math.random() * tools.length));
  }, []);

  useEffect(function () {
    timerRef.current = setInterval(function () {
      setVisible(false);
      setTimeout(function () {
        setIdx(function (prev) {
          if (tools.length <= 1) return prev;
          var next;
          do { next = Math.floor(Math.random() * tools.length); } while (next === prev);
          return next;
        });
        setVisible(true);
      }, 570);
    }, 10000);
    return function () { clearInterval(timerRef.current); };
  }, []);

  var tool = tools[idx];
  var color = categoryColor[tool.category] || "var(--upload-btn-bg)";
  var href = tool.href || ("/tools/" + tool.slug + "/");
  var cta = tool.cta || ("Try " + tool.name);

  return (
    <a
      href={href}
      className="promo-banner"
      data-category={tool.category}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.57s ease",
      }}
    >
      <div
        data-icon-palette={tool.iconPalette}
        style={{ width: "48px", height: "48px", borderRadius: "12px", flexShrink: "0", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent" }}
      >
        {(() => { const Icon = iconMap[tool.iconClass]; return Icon ? <Icon size={28} stroke={1.75} color={paletteColors[tool.iconPalette] || 'currentColor'} /> : null; })()}
      </div>
      <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span className="promo-hook">{tool.hook}</span>
        <span style={{ fontSize: "15px", fontWeight: "700", color: color, lineHeight: "1.3" }}>{cta}</span>
      </span>
    </a>
  );
}
