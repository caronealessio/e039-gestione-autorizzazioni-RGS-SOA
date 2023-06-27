sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("rgssoa.controller.DocumentiCosto", {
    onNavBack: function () {
      history.go(-1);
    },
  });
});
