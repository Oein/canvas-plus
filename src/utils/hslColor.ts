let clr = 1;
export default function hslColor(alpha = 1) {
  clr += 0.3819660112501051;
  clr %= 360;
  return `hsla(${clr}, 100%, 50%, ${alpha})`;
}
