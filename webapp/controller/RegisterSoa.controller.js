sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("rgssoa.controller.RegisterSoa", {
    onNavBack: function () {
      history.go(-1);
    },

    onDocumentiCosto: function () {
      var self = this;
      self.getRouter().navTo("documentiCosto");
    },

    onNoDocumentiCosto: function () {
      var self = this;
      self.getRouter().navTo("noDocumentiCosto");
    },
  });
});
