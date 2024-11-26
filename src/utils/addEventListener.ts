import debug from "./debugMsg";
import XYfromEvent from "./xyfromEvent";

const listenerCch: any = {};
let lastTouch = { x: -1, y: -1 };

export function ael(
  el: HTMLElement | Document,
  type: string | string[],
  listener: any
) {
  if (Array.isArray(type)) {
    type.forEach((t) => {
      if (t.includes("mouse")) return;
      if (!listenerCch[t]) listenerCch[t] = new Map();
      listenerCch[t].set(listener, (e: any) => {
        // if (t.includes("pointer"))
        // if (e.target.hasPointerCapture(e.pointerId)) {
        //   e.target.releasePointerCapture(e.pointerId);
        // }
        // if (e.includes("pointerdown")) e.target.setPointerCapture(e.pointerId);
        if (t.includes("touchdown")) return;
        if (t.includes("touchup")) return;
        if (t.includes("touchmove")) return e.preventDefault();
        // debug("Event: " + t);
        let XY = XYfromEvent(e);
        // if (XY.x === -1 && XY.y === -1) XY = lastTouch;
        Object.defineProperty(e, "clientX", { value: XY.x });
        Object.defineProperty(e, "clientY", { value: XY.y });
        if (XY.x === -1 && XY.y === -1) return;
        if (t.includes("pointerup"))
          debug(
            `<Puent> ${t} [${(XY.x - lastTouch.x).toFixed(5)}, ${(
              XY.y - lastTouch.y
            ).toFixed(5)}] ${XY.x.toFixed(5)} ${XY.y.toFixed(5)} `
          );
        lastTouch = XY;

        listener(e);
      });
      el.addEventListener(t, listenerCch[t].get(listener));
    });
  } else {
    if (!listenerCch[type]) listenerCch[type] = new Map();
    listenerCch[type].set(listener, (e: any) => {
      if (type.includes("mouse")) return;
      // if (type.includes("pointer"))
      //   if (e.target.hasPointerCapture(e.pointerId)) {
      //     e.target.releasePointerCapture(e.pointerId);
      //   }
      // if (type.includes("pointerdown")) e.target.setPointerCapture(e.pointerId);
      if (type.includes("touchdown")) return;
      if (type.includes("touchmove")) return e.preventDefault();
      // debug("Event: " + type);
      let XY = XYfromEvent(e);
      if (XY.x === -1 && XY.y === -1) XY = lastTouch;
      Object.defineProperty(e, "clientX", { value: XY.x });
      Object.defineProperty(e, "clientY", { value: XY.y });
      if (XY.x === -1 && XY.y === -1) return;
      // debug(
      //   `<Event> ${type} [${(XY.x - lastTouch.x).toFixed(5)}, ${(
      //     XY.y - lastTouch.y
      //   ).toFixed(5)}] ${XY.x.toFixed(5)} ${XY.y.toFixed(5)} `
      // );
      lastTouch = XY;
      listener(e);
    });
    el.addEventListener(type, listenerCch[type].get(listener));
  }
}

export function rel(
  el: HTMLElement | Document,
  type: string | string[],
  listener: any
) {
  if (Array.isArray(type)) {
    type.forEach((t) => {
      if (t.includes("mouse")) return;
      el.removeEventListener(t, listenerCch[t].get(listener));
    });
  } else {
    if (type.includes("mouse")) return;
    el.removeEventListener(type, listenerCch[type].get(listener));
  }
}
