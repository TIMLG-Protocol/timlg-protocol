import { s as styles_default, c as classRenderer_v3_unified_default, a as classDiagram_default, C as ClassDB } from "./chunk-B4BG7PRW-BdlCVkJH.js";
import { _ as __name } from "./index-B1z2rF0e.js";
import "./chunk-FMBD7UC4-DdT2BNb-.js";
import "./chunk-55IACEB6-B7VVCtn4.js";
import "./chunk-QN33PNHL-DYc6C2EZ.js";
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
