import { s as styles_default, c as classRenderer_v3_unified_default, a as classDiagram_default, C as ClassDB } from "./chunk-B4BG7PRW-D10Fp0if.js";
import { _ as __name } from "./index-DEXD0Rts.js";
import "./chunk-FMBD7UC4-DqcIn5B4.js";
import "./chunk-55IACEB6-CI6Uc9Dz.js";
import "./chunk-QN33PNHL-CWVtPmwi.js";
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
