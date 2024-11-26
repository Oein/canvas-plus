import debug from "./debugMsg";

const state: any = {
  PENCOLOR: "#000000",
  PENSTROKE: 3,
  DASHLINE: [12, 18],
  ISDASH: false,
  SNAP_RIGHT: true,
  SHIFT: false,
  SHIFTTOOL: false,
  FILLTOOL: false,
};
export function getState<T = any>(key: string) {
  return state[key] as T;
}

export function setState(key: string, value: any) {
  debug(`<State> ${key} : ${value}`);
  state[key] = value;
}

(window as any).getState = getState;
(window as any).setState = setState;
(window as any).state = state;
