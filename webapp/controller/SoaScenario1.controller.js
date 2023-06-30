sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("rgssoa.controller.SoaScenario1", {
      formatter: formatter,
      onInit: function () {
        this.getRouter()
          .getRoute("soaScenario1")
          .attachPatternMatched(this._onObjectMatched, this);
      },
      onNavBack: function () {
        var self = this;
        var oWizard = self.getView().byId("wizScenario1");
        if (oWizard.getProgress() !== 1) {
          oWizard.previousStep();
        } else {
          history.go(-1);
        }
      },
      _onObjectMatched: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oView = self.getView();
        var oParameters = oEvent.getParameter("arguments");
        var sPath = self
          .getModel()
          .createKey("ChiaveAutorizzazioneSet", oParameters);

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + sPath, {
              success: function (data, oResponse) {
                var oModel = new JSONModel();

                oModel.setData(data);
                oView.setModel(oModel, "SoaDetail");
              },
              error: function () {},
            });
          });
      },
      onNavForward: function () {
        var self = this;
        var oWizard = self.getView().byId("wizScenario1");
        if (oWizard.getProgress() !== 4) {
          oWizard.nextStep();
        }
      },
      onValueHelpRitenuta: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.openDialog(
          "rgssoa.view.fragment.valueHelp." + sFragmentName
        );

        //Resetto l'input dell'Ente Beneficiario ogni qual volta imposto una Ritenuta
        var oInputEnteBen = self.getView().byId("fltEnteBeneficiario");
        oInputEnteBen.setValue(null);
        oInputEnteBen.data("key", null);

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaRitenutaSet", {
              success: function (data, oResponse) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "RicercaRitenuta");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpEnteBeneficiario: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.openDialog(
          "rgssoa.view.fragment.valueHelp." + sFragmentName
        );
        var oInputRitenuta = self.getView().byId("fltRitenuta");

        if (oInputRitenuta.data("key")) {
          var oFilter = [];
          oFilter.push(
            new Filter(
              "CodRitenuta",
              FilterOperator.EQ,
              oInputRitenuta.data("key")
            )
          );
        }

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaEnteBeneficiarioSet", {
              filters: oFilter,
              success: function (data, oResponse) {
                self.setResponseMessage(oResponse);
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "RicercaEnteBeneficiario");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },
    });
  }
);
