import debug from "./debugMsg";

let CONFIG = {
  SCALE: 1,
  TEXT_RES: 1.5,
  SNAP_DEG: 2,
  SELECT_RATIO: 0.3,
  IMAGE_GLOBAL_PADDING: 50,
  MAX_HISTORY: 50,

  DO_NOT_UPDATE_DIST: 1,
  DO_NOT_RENDER_DIST: 3,
  DO_NOT_RENDER_ANGLE: 3,
};

if (localStorage.getItem("CONFIG")) {
  const savedConfig = JSON.parse(localStorage.getItem("CONFIG") || "{}");
  CONFIG = { ...CONFIG, ...savedConfig };
} else localStorage.setItem("CONFIG", JSON.stringify(CONFIG));

debug(`<Cnfig> ${JSON.stringify(CONFIG)}`);

export default CONFIG;
