export default function XYfromEvent(e: MouseEvent | TouchEvent | PointerEvent) {
  if ("targetTouches" in e) {
    if (!e.targetTouches.item(0)) return { x: -1, y: -1 };
    else e.preventDefault();
    return {
      x: e.targetTouches.item(0)!.pageX,
      y: e.targetTouches.item(0)!.pageY,
    };
  } else {
    return {
      x: e.pageX || e.offsetX || e.clientX,
      y: e.pageY || e.offsetY || e.clientY,
    };
  }
}
