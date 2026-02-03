import { s as styles_default, c as classRenderer_v3_unified_default, a as classDiagram_default, C as ClassDB } from "./chunk-B4BG7PRW-DbkIAYqe.js";
import { _ as __name } from "./index-Pp3SLOgb.js";
import "./chunk-FMBD7UC4-DlUlOHqW.js";
import "./chunk-55IACEB6-BiR92aWY.js";
import "./chunk-QN33PNHL-B5u2YeRy.js";
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
