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

    const EQ = FilterOperator.EQ;
    const NE = FilterOperator.NE;
    const SOA_ENTITY_SET = "SOASet";
    const SOA_MODEL = "SOASet";
    const PAGINATOR_MODEL = "paginatorModel";

    return BaseController.extend("rgssoa.controller.SOAPage", {
      formatter: formatter,
      /**
       * @override
       */
      onInit: function () {
        var oModelPaginator = new JSONModel({
          btnPrevEnabled: false,
          btnFirstEnabled: false,
          btnNextEnabled: false,
          btnLastEnabled: false,
          recordForPageEnabled: false,
          currentPageEnabled: true,
          numRecordsForPage: 10,
          currentPage: 1,
          maxPage: 1,
          paginatorSkip: 0,
          paginatorClick: 0,
          paginatorTotalPage: 1,
        });

        var oSoaModel = new JSONModel({
          totalItems: 0,
        });

        this.setModel(oModelPaginator, PAGINATOR_MODEL);
        this.setModel(oSoaModel, SOA_MODEL);
      },
      onNavBack: function () {
        history.go(-1);
      },
      onAfterRendering: function () {
        this._getTipoDisponibilitaList([]);
      },

      onTipologiaAutorizzazioneChange: function (oEvent) {
        var aFilters = [];
        var iKey = oEvent.getParameters().selectedItem.getKey();

        aFilters.push(new Filter("Ztipodisp2", EQ, iKey));

        this._getTipoDisponibilitaList(aFilters);
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
            oDataModel.read("/" + "RitenutaSet", {
              success: function (data, oResponse) {
                self.setResponseMessage(oResponse);
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "Ritenuta");
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
            new Filter("CodRitenuta", EQ, oInputRitenuta.data("key"))
          );
          oFilter.push(
            new Filter("DescRitenuta", EQ, oInputRitenuta.getValue())
          );
        }

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "EnteBeneficiarioSet", {
              filters: oFilter,
              success: function (data, oResponse) {
                self.setResponseMessage(oResponse);
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "EnteBeneficiario");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onToggle: function () {
        var self = this,
          oView = self.getView(),
          oBundle = self.getResourceBundle();

        var btnArrow = oView.byId("btnToggle");
        var panelFilter = oView.byId("grdFilter");
        if (btnArrow.getIcon() === "sap-icon://slim-arrow-up") {
          btnArrow.setIcon("sap-icon://slim-arrow-down");
          btnArrow.setTooltip(oBundle.getText("tooltipArrowShow"));
          panelFilter.setVisible(false);
        } else {
          btnArrow.setIcon("sap-icon://slim-arrow-up");
          btnArrow.setTooltip(oBundle.getText("tooltipArrowHide"));
          panelFilter.setVisible(true);
        }
      },

      onBlockToggle: function () {
        var self = this,
          oView = self.getView();

        var btnArrow = oView.byId("btnToggle");
        btnArrow.getEnabled()
          ? btnArrow.setEnabled(false)
          : btnArrow.setEnabled(true);
      },

      onSearch: function () {
        this._setPaginatorProperties();
        this._getSoaList();
      },

      onFirstPaginator: function () {
        var self = this;

        self.getFirstPaginator(PAGINATOR_MODEL);
        this._getSoaList();
      },

      onLastPaginator: function () {
        var self = this;

        self.getLastPaginator(PAGINATOR_MODEL);
        this._getSoaList();
      },

      onChangePage: function (oEvent) {
        var self = this;

        self.getChangePage(oEvent, PAGINATOR_MODEL);
        this._getSoaList();
      },

      /** -----------------PRIVATE METHODS------------------- */

      _getSoaList: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oView = self.getView();
        var oFilters = this._getHeaderFilters();
        var oPaginator = oView.byId("pnlPaginator");
        var oListSoa = oView.byId("vbxListSoa");

        oView.setBusy(true);

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + SOA_ENTITY_SET, {
              // urlParameters: {
              //   $top: numRecordsForPage,
              //   $skip: skip,
              // },
              filters: oFilters,
              success: function (data, oResponse) {
                self.setResponseMessage(oResponse);
                self.setPaginatorVisible(oPaginator, data);
                oListSoa.setVisible(true);

                var oModelJson = new sap.ui.model.json.JSONModel();
                oModelJson.setData(data.results);
                oView.setModel(oModelJson, SOA_MODEL);
                self.getView().setBusy(false);
              },
              error: function (error) {
                oView.setBusy(false);
              },
            });
          });
      },

      _setPaginatorProperties: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oFilters = this._getHeaderFilters();
        var oPaginator = self.getModel(PAGINATOR_MODEL);

        self.resetPaginator(oPaginator);
        var numRecordsForPage = oPaginator.getProperty("/numRecordsForPage");

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + SOA_ENTITY_SET + "/$count", {
              filters: oFilters,
              success: function (data) {
                self.getModel(SOA_MODEL).setProperty("/totalItems", data);
                if (data > numRecordsForPage) {
                  oPaginator.setProperty("/btnLastEnabled", true);

                  var paginatorTotalPage = data / numRecordsForPage;
                  var moduleN = Number.isInteger(paginatorTotalPage);

                  if (!moduleN) {
                    paginatorTotalPage = Math.trunc(paginatorTotalPage) + 1;
                  }
                  oPaginator.setProperty(
                    "/paginatorTotalPage",
                    paginatorTotalPage
                  );
                  oPaginator.setProperty("/maxPage", paginatorTotalPage);
                } else {
                  oPaginator.setProperty("/maxPage", 1);
                  oPaginator.setProperty("/btnLastEnabled", false);
                }
              },
              error: function () {},
            });
          });
      },

      _getHeaderFilters: function () {
        var self = this;
        var aFilters = [];

        var oEsercizioGestione = self.getView().byId("fltGjahr");
        var oAmministrazione = self.getView().byId("fltZzamministr");
        var oCapitolo = self.getView().byId("fltZcapitolo");
        var oNumSoaFrom = self.getView().byId("fltZnumsopFrom");
        var oNumSoaTo = self.getView().byId("fltZnumsopTo");
        var oStatoSoa = self.getView().byId("fltZcodStatosop");
        var oChiaveAut = self.getView().byId("fltZchiaveaut");
        var oTipoAutorizzazione = self.getView().byId("fltZtipodisp2");
        var oTipoDisposizione = self.getView().byId("fltZtipodisp3");
        var oTipoSoa = self.getView().byId("fltZztipologia");
        var oTipoTitolo = self.getView().byId("fltDescTipopag");
        var oSpecieSoa = self.getView().byId("fltZspecieSop");
        //Richiesta annullamento
        var oRichAnnullamento = self.getView().byId("fltZricann");
        var oDataRegSoaFrom = self.getView().byId("fltZdatasopFrom");
        var oDataRegSoaTo = self.getView().byId("fltZdatasopTo");
        //Data Protocollo Amm.
        var oDataProtAmm = self.getView().byId("fltZdataprot");
        //Num Protocollo Amm.
        var oNumProtAmm = self.getView().byId("fltZnumprot");
        var oBeneficiario = self.getView().byId("fltLifnr");
        var oRitenuta = self.getView().byId("fltRitenuta");
        var oEnteBeneficiario = self.getView().byId("fltEnteBeneficiario");
        //Posizione Finanziaria
        var oPosFinanziariaFrom = self.getView().byId("fltFiposFrom");
        var oPosFinanziariaTo = self.getView().byId("fltFiposTo");
        //Struttura Amministrativa Responsabile
        var oStrAmmResponsabile = self.getView().byId("fltFistl");
        //N. Prospetto di liquidazione
        var oNumProLiquidazioneFrom = self.getView().byId("fltZnumliqFrom");
        var oNumProLiquidazioneTo = self.getView().byId("fltZnumliqTo");
        //Descrizione Prospetto di liquidazione
        var oDescProLiquidazione = self.getView().byId("fltZdescProsp");

        self.setFilterEQKey(aFilters, oEsercizioGestione);
        self.setFilterEQValue(aFilters, oAmministrazione);
        self.setFilterEQValue(aFilters, oCapitolo);
        self.setFilterBTValue(aFilters, oNumSoaFrom, oNumSoaTo);
        self.setFilterEQKey(aFilters, oStatoSoa);
        //TODO - Settarlo quando viene inserito il MC code
        self.setFilterEQValue(aFilters, oChiaveAut);
        self.setFilterEQKey(aFilters, oTipoAutorizzazione);
        self.setFilterEQKey(aFilters, oTipoDisposizione);
        self.setFilterEQKey(aFilters, oTipoSoa);
        self.setFilterEQKey(aFilters, oTipoTitolo);
        self.setFilterEQKey(aFilters, oSpecieSoa);
        self.setFilterBTValue(aFilters, oDataRegSoaFrom, oDataRegSoaTo);
        self.setFilterEQValue(aFilters, oDataProtAmm);
        self.setFilterEQValue(aFilters, oNumProtAmm);
        self.setFilterEQValue(aFilters, oBeneficiario);
        self.setFilterEQKeyMC(aFilters, oRitenuta);
        self.setFilterEQKeyMC(aFilters, oEnteBeneficiario);
        self.setFilterBTValue(aFilters, oPosFinanziariaFrom, oPosFinanziariaTo);
        self.setFilterEQValue(aFilters, oStrAmmResponsabile);
        self.setFilterBTValue(
          aFilters,
          oNumProLiquidazioneFrom,
          oNumProLiquidazioneTo
        );
        self.setFilterEQValue(aFilters, oDescProLiquidazione);

        if (oRichAnnullamento?.getSelectedKey() === "Si") {
          aFilters.push(
            new Filter(oRichAnnullamento.data("searchPropertyModel"), NE, "")
          );
        } else {
          aFilters.push(
            new Filter(oRichAnnullamento.data("searchPropertyModel"), EQ, "")
          );
        }

        return aFilters;
      },

      _getTipoDisponibilitaList: function (aFilters) {
        var self = this;
        var oDataModel = self.getModel();

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/TipoDisp3Set", {
              filters: aFilters,
              success: function (data, oResponse) {
                self.setResponseMessage(oResponse);
                var oModelJson = new sap.ui.model.json.JSONModel();
                oModelJson.setData(data.results);
                self.getView().setModel(oModelJson, "TipoDisp3Set");
              },
              error: function (error) {},
            });
          });
      },
    });
  }
);
