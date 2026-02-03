import { s as styles_default, c as classRenderer_v3_unified_default, a as classDiagram_default, C as ClassDB } from "./chunk-B4BG7PRW-BZxz3tt2.js";
import { _ as __name } from "./index-B0nY6KpU.js";
import "./chunk-FMBD7UC4-D3z6rYVG.js";
import "./chunk-55IACEB6-B6E5r14i.js";
import "./chunk-QN33PNHL-By5F_jKl.js";
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
