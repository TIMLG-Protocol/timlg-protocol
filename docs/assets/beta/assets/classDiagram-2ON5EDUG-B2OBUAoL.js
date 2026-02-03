import { s as styles_default, c as classRenderer_v3_unified_default, a as classDiagram_default, C as ClassDB } from "./chunk-B4BG7PRW-DUYsM4oK.js";
import { _ as __name } from "./index-CH0z_33b.js";
import "./chunk-FMBD7UC4-B2XiacU_.js";
import "./chunk-55IACEB6-BH4KNhvo.js";
import "./chunk-QN33PNHL-hpUSO6Eg.js";
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
