import { iconMap } from '../data/tablerIconMap.js';

export default function ToolIcon({ name, size = 24, color, stroke = 2 }) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon size={size} color={color} stroke={stroke} />;
}
