let clr = 1;
export default function hslColor(alpha = 1) {
  clr += 0.5;
  clr %= 360;
  return `hsla(${clr}, 100%, 50%, ${alpha})`;
}
