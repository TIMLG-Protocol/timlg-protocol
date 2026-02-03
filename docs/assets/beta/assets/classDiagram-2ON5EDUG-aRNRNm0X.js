import { s as styles_default, c as classRenderer_v3_unified_default, a as classDiagram_default, C as ClassDB } from "./chunk-B4BG7PRW-B2aeTrkS.js";
import { _ as __name } from "./index-D5H0iP4L.js";
import "./chunk-FMBD7UC4-Bmb8F3Oj.js";
import "./chunk-55IACEB6-DwOq7_r3.js";
import "./chunk-QN33PNHL-Bf4ky-PB.js";
var diagram = {
  parser: classDiagram_default,
  get db() {
    return new ClassDB();
  },
  renderer: classRenderer_v3_unified_default,
  styles: styles_default,
  init: /* @__PURE__ */ __name((cnf) => {
    if (!cnf.class) {
      cnf.class = {};
    }
    cnf.class.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }, "init")
};
export {
  diagram
};
