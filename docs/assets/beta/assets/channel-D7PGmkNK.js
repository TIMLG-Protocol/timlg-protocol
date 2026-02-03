import { ap as Utils, aq as Color } from "./index-D5H0iP4L.js";
const channel = (color, channel2) => {
  return Utils.lang.round(Color.parse(color)[channel2]);
};
export {
  channel as c
};
