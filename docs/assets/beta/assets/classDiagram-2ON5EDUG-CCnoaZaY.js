import { s as styles_default, c as classRenderer_v3_unified_default, a as classDiagram_default, C as ClassDB } from "./chunk-B4BG7PRW-rRzUYHV5.js";
import { _ as __name } from "./index-DrLDXg10.js";
import "./chunk-FMBD7UC4-BsuT1Jii.js";
import "./chunk-55IACEB6-DHPZ3Bt0.js";
import "./chunk-QN33PNHL-C4njc3Hc.js";
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
