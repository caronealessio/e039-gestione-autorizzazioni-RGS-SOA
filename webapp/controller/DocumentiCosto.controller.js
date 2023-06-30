sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/m/MessageBox",
  ],
  function (
    BaseController,
    Filter,
    FilterOperator,
    JSONModel,
    formatter,
    MessageBox
  ) {
    "use strict";

    return BaseController.extend("rgssoa.controller.DocumentiCosto", {
      formatter: formatter,
      onNavBack: function () {
        history.go(-1);
      },
      onSelectEsercizioGestione: function (oEvent) {
        var self = this;
        var oView = self.getView();
        var oInputChiaveAutorizzazione = oView.byId("fltChiaveAutorizzazione");

        oInputChiaveAutorizzazione.resetProperty("value");

        var oChiaveAutorizzazioneModel = new JSONModel({
          dataAutorizzazione: null,
          impAutorizzato: null,
          dispAutorizzato: null,
          tipoAutorizzato: null,
          tipoDisposizione: null,
          noteAutorizzazione: null,
          ufficioOrdinante: null,
          descUfficioOrdinante: null,
          codiceFD: null,
          descCodiceFD: null,
          posFinanziaria: null,
          strAmmResponsabile: null,
          pianoGestione: null,
          dataStatoString: null,
        });

        oView.setModel(oChiaveAutorizzazioneModel, "ChiaveAutorizzazione");
      },
      onValueHelpChiaveAutorizzazione: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.openDialog(
          "rgssoa.view.fragment.valueHelp." + sFragmentName
        );
        var oInputEsercizioGestione = self
          .getView()
          .byId("fltEsercizioGestione");

        if (oInputEsercizioGestione?.getSelectedKey()) {
          var oFilter = [];
          oFilter.push(
            new Filter(
              "Gjahr",
              FilterOperator.EQ,
              oInputEsercizioGestione.getSelectedKey()
            )
          );
        }

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "ChiaveAutorizzazioneSet", {
              filters: oFilter,
              success: function (data, oResponse) {
                self.setResponseMessage(oResponse);
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "ChiaveAutorizzazione");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },
      onValueHelpChiaveAutorizzazioneClose: function (oEvent) {
        var self = this;
        var oView = self.getView();
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sInput = oSource.data().input;

        var oInput = self.getView().byId(sInput);

        var oChiaveAutorizzazioneModel = new JSONModel({
          zChiaveAut: oSelectedItem?.data("zChiaveAut"),
          bukrs: oSelectedItem?.data("bukrs"),
          gjahr: oSelectedItem?.data("gjahr"),
          dataAutorizzazione: oSelectedItem?.data("dataAutorizzazione"),
          impAutorizzato: oSelectedItem?.data("impAutorizzato"),
          dispAutorizzato: oSelectedItem?.data("dispAutorizzato"),
          tipoAutorizzato: oSelectedItem?.data("tipoAutorizzato"),
          tipoDisposizione: oSelectedItem?.data("tipoDisposizione"),
          noteAutorizzazione: oSelectedItem?.data("noteAutorizzazione"),
          ufficioOrdinante: oSelectedItem?.data("ufficioOrdinante"),
          descUfficioOrdinante: oSelectedItem?.data("descUfficioOrdinante"),
          codiceFD: oSelectedItem?.data("codiceFD"),
          descCodiceFD: oSelectedItem?.data("descCodiceFD"),
          posFinanziaria: oSelectedItem?.data("posFinanziaria"),
          strAmmResponsabile: oSelectedItem?.data("strAmmResponsabile"),
          pianoGestione: oSelectedItem?.data("pianoGestione"),
          dataStatoString: oSelectedItem?.data("dataStatoString"),
        });

        oView.setModel(oChiaveAutorizzazioneModel, "ChiaveAutorizzazione");

        var oInputFlagFipos = self.getView().byId("cbxFlagFipos");
        if (oSelectedItem?.data("flagFipos")) {
          oInputFlagFipos.setSelected(true);
        } else {
          oInputFlagFipos.setSelected(false);
        }

        if (!oSelectedItem) {
          oInput.resetProperty("value");
          self.closeDialog();
          return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        self.closeDialog();
      },
      onNavForward: function () {
        var self = this;
        var oView = self.getView();
        var oChiaveAutorizzazioneModel = oView.getModel("ChiaveAutorizzazione");

        var oParameters = {
          Zchiaveaut: oChiaveAutorizzazioneModel?.getProperty("/zChiaveAut"),
          Bukrs: oChiaveAutorizzazioneModel?.getProperty("/bukrs"),
          Gjahr: oChiaveAutorizzazioneModel?.getProperty("/gjahr"),
        };

        if (
          !oParameters?.Zchiaveaut ||
          !oParameters?.Bukrs ||
          !oParameters?.Gjahr
        ) {
          MessageBox.error("Inserire una Autorizzazione valida");
          return;
        }
        self.getRouter().navTo("soaScenario1", oParameters);
      },
    });
  }
);
