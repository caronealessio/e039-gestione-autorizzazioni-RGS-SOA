sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  return Controller.extend("rgssoa.controller.NoDocumentiCosto", {
    onNavBack: function () {
      history.go(-1);
    },
  });
});
