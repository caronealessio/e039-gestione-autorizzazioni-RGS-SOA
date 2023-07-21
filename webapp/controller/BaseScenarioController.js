sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
  ],
  function (BaseController, Filter, FilterOperator, JSONModel) {
    "use strict";

    return BaseController.extend("rgssoa.controller.BaseScenarioController", {
      //#region WIZARD 1

      //#region VALUE HELP

      onValueHelpRitenuta: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti." +
            sFragmentName
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
        self.unloadFragment();
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti." +
            sFragmentName
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
                oSelectDialog?.setModel(oModelJson, "EnteBeneficiario");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpRitenutaClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sInput = oSource.data().input;
        var oInput = self.getView().byId(sInput);
        var sKey = oSelectedItem?.data("key");

        this._setEditableBeneficiario(oSelectedItem);
        oModelSoa.setProperty("/Text40", oSelectedItem?.getTitle());
        oModelSoa.setProperty("/Witht", sKey);

        if (!oSelectedItem) {
          oInput.resetProperty("value");
          oInput.data("key", null);
          this.unloadFragment();
          return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        oInput.data("key", sKey);
        this.unloadFragment();
      },

      onValueHelpEnteBeneficiarioClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sInput = oSource.data().input;
        var oInput = self.getView().byId(sInput);
        var sKey = oSelectedItem?.data("key");

        this._setEditableBeneficiario(oSelectedItem);
        oModelSoa.setProperty("/ZzDescebe", oSelectedItem?.getTitle());
        oModelSoa.setProperty("/ZzCebenra", sKey);

        if (oSelectedItem) {
          this._setSpecieSoaDesc("2");
        } else {
          oInput.resetProperty("value");
          oModelSoa.setProperty("/DescZspecieSop", null);
          oModelSoa.setProperty("/ZspecieSop", null);
          oInput.data("key", null);
          this.unloadFragment();
          return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        oInput.data("key", sKey);
        this.unloadFragment();
      },

      onValueHelpBeneficiario: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        self.unloadFragment();
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti." +
            sFragmentName
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaBeneficiarioSet", {
              success: function (data, oResponse) {
                self.setResponseMessage(oResponse);
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "Beneficiario");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpBeneficiarioClose: function (oEvent) {
        var self = this;
        var oView = self.getView();
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sInput = oSource.data().input;

        var oInput = self.getView().byId(sInput);

        var oBeneficiario = new JSONModel({
          Lifnr: oSelectedItem?.data("key"),
          TypeBen: oSelectedItem?.data("typeBen"),
          Name: oSelectedItem?.data("name"),
          Surname: oSelectedItem?.data("surname"),
          RagSociale: oSelectedItem?.data("ragSociale"),
          CodFiscale: oSelectedItem?.data("codFiscale"),
          CodFiscaleEstero: oSelectedItem?.data("codFiscaleEstero"),
          PIva: oSelectedItem?.data("pIva"),
        });

        //Imposto i valori del dettaglio
        oModelSoa.setProperty("/Lifnr", oSelectedItem?.data("key"));
        oModelSoa.setProperty("/NameFirst", oSelectedItem?.data("name"));
        oModelSoa.setProperty("/NameLast", oSelectedItem?.data("surname"));
        oModelSoa.setProperty("/ZzragSoc", oSelectedItem?.data("ragSociale"));
        oModelSoa.setProperty("/TaxnumCf", oSelectedItem?.data("codFiscale"));
        oModelSoa.setProperty("/TaxnumPiva", oSelectedItem?.data("pIva"));
        oModelSoa.setProperty("/BuType", oSelectedItem?.data("typeBen"));

        oView.setModel(oBeneficiario, "Beneficiario");
        this._setEditableRitenuta(oSelectedItem);

        if (oSelectedItem) {
          this._setSpecieSoaDesc("1");
        } else {
          oInput.resetProperty("value");
          oModelSoa.setProperty("/DescZspecieSop", null);
          oModelSoa.setProperty("/ZspecieSop", null);
          self.clearModel("AnnoDocBeneficiario");
          self.unloadFragment();
          return;
        }

        oInput.setValue(oSelectedItem.getTitle());

        var aFiltersAnnoDocBeneficiario = [];
        aFiltersAnnoDocBeneficiario.push(
          new Filter("Lifnr", FilterOperator.EQ, oSelectedItem.getTitle())
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaAnnoDocBeneSet", {
              filters: aFiltersAnnoDocBeneficiario,
              success: function (data, oResponse) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                self.getView().setModel(oModelJson, "AnnoDocBeneficiario");
              },
              error: function (error) {},
            });
          });

        self.unloadFragment();
      },

      onValueHelpUffContabile: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti." +
            sFragmentName
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaUfficioContabileSet", {
              success: function (data, oResponse) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "UfficioContabile");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpUffPagatore: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti." +
            sFragmentName
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaUfficioPagatoreSet", {
              success: function (data, oResponse) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "UfficioPagatore");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpNRegDocumento: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti." +
            sFragmentName
        );
        var oSelectDialog = sap.ui.getCore().byId(dialogName);
        oSelectDialog.data("input", oSourceData.input);
        var oInputAnnoRegDocumento = self.getView().byId("fltAnnoRegDoc");
        var aKeys = oInputAnnoRegDocumento.getSelectedKeys();
        var aFilters = [];

        aKeys.map((sKey) => {
          aFilters.push(new Filter("Gjahr", FilterOperator.EQ, sKey));
        });

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaNumRegDocSet", {
              filters: aFilters,
              success: function (data, oResponse) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                oSelectDialog?.setModel(oModelJson, "NRegDocumento");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpNumDocBene: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti." +
            sFragmentName
        );
        var oInputAnnoDocBene = self.getView().byId("fltAnnoDocBene");
        var aKeys = oInputAnnoDocBene.getSelectedKeys();
        var aFilters = [];

        aKeys.map((sKey) => {
          aFilters.push(new Filter("Gjahr", FilterOperator.EQ, sKey));
        });

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaNumDocBeneSet", {
              filters: aFilters,
              success: function (data, oResponse) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "NDocBeneficiario");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      /** -------------SCENARIO 3------------ */
      onValueHelpNProspLiquidazione: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti." +
            sFragmentName
        );
        var oSelectDialog = sap.ui.getCore().byId(dialogName);
        oSelectDialog?.data("input", oSourceData.input);

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaNProspLiqSet", {
              success: function (data, oResponse) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                oSelectDialog?.setModel(oModelJson, "NProspLiquidazione");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpDescProspLiquidazione: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti." +
            sFragmentName
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaDescProspLiqSet", {
              success: function (data, oResponse) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "DescProspLiquidazione");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpUffLiquidatore: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti." +
            sFragmentName
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaUffLiquidatoreSet", {
              success: function (data, oResponse) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "UfficioLiquidatore");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      //#endregion

      //#region SELECTION CHANGE

      onChangeAnnoRegDoc: function () {
        var self = this;
        self.clearModel("NRegDocumento");
        var oInputNRegDocumentoFrom = self.getView().byId("fltNRegDocFrom");
        var oInputNRegDocumentoTo = self.getView().byId("fltNRegDocTo");

        oInputNRegDocumentoFrom.resetProperty("value");
        oInputNRegDocumentoTo.resetProperty("value");
      },

      onChangeAnnoDocBene: function () {
        var self = this;
        self.clearModel("NDocBeneficiario");
        var oInputNDocBeneficiario = self.getView().byId("fltNDocBene");

        oInputNDocBeneficiario.resetProperty("value");
      },

      onTipoBeneficiarioChange: function (oEvent) {
        var self = this;
        var oInput = self.getView().byId("fltTipoBeneficiario");
        var oModelSoa = self.getModel("Soa");

        this._setEditableRitenuta(oEvent.getParameter("value"));
        oModelSoa.setProperty("/BuType", oInput.getSelectedKey());
      },

      onDataEseChange: function (oEvent) {
        this._setEditableBeneficiario(oEvent.getParameter("value"));
      },

      //#endregion

      //#region PRIVATE METHODS

      _setEditableBeneficiario: function (item) {
        var self = this;
        var oView = self.getView();
        var bEditable = item ? false : true;

        var oInputTipoBeneficiario = oView.byId("fltTipoBeneficiario");
        var oInputBeneficiario = oView.byId("fltBeneficiario");

        //Rendo tutti i campi non editabili
        oInputTipoBeneficiario.setEditable(bEditable);
        oInputBeneficiario.setEditable(bEditable);
      },

      _setEditableRitenuta: function (item) {
        var self = this;
        var oView = self.getView();
        var bEditable = item ? false : true;

        var oInputRitenuta = oView.byId("fltRitenuta");
        var oInputEnteBeneficiario = oView.byId("fltEnteBeneficiario");
        var oInputQuoteEsibigili = oView.byId("fltQuoteEsigibili");
        var oInputDataEseFrom = oView.byId("fltDataEsigibilitaFrom");
        var oInputDataEseTo = oView.byId("fltDataEsigibilitaTo");

        //Rendo tutti i campi non editabili
        oInputRitenuta.setEditable(bEditable);
        oInputEnteBeneficiario.setEditable(bEditable);
        oInputQuoteEsibigili.setEditable(bEditable);
        oInputDataEseFrom.setEditable(bEditable);
        oInputDataEseTo.setEditable(bEditable);

        //Resetto eventuali valori già inseriti
        oInputQuoteEsibigili.setSelected(bEditable);
      },

      _setSpecieSoaDesc: function (sValue) {
        var self = this;
        //Load Models
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var oParameters = {
          ZspecieSoa: sValue,
        };
        var sPath = self.getModel().createKey("SpecieSOASet", oParameters);
        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oModel.read("/" + sPath, {
              success: function (data, oResponse) {
                oModelSoa.setProperty("/DescZspecieSop", data?.ZdescSpecieSoa);
                oModelSoa.setProperty("/ZspecieSop", data?.ZspecieSoa);
              },
              error: function () {},
            });
          });
      },

      //#endregion PRIVATE METHODS

      //#endregion

      //#region WIZARD 2

      //#region INSERISCI MODALITA PAGAMENTO

      onNewQuietanzante: function () {
        var self = this;
        var oBundle = self.getResourceBundle();
        var oModelNewModPag = self.getModel("NewModalitaPagamento");

        oModelNewModPag.setProperty("/VisibleNewModalitaPagamento", false);
        oModelNewModPag.setProperty("/VisibleNewQuietanzante", true);
        oModelNewModPag.setProperty(
          "/titleDialog",
          oBundle.getText("titleNewQuietanzante")
        );
      },

      onNewModalitaPagamento: function () {
        var self = this;
        var oFragmentNewModPag = self.loadFragment(
          "rgssoa.view.fragment.pop-up.NewModalitaPagamento"
        );

        this._getNpmModalitaPagamento();

        oFragmentNewModPag.open();

        var oDialogNewModPag = sap.ui.getCore().byId("dlgNewModalitaPagamento");
        oDialogNewModPag.attachBrowserEvent("keydown", function (oEvent) {
          if (oEvent.key === "Escape") {
            oEvent.stopPropagation();
          }
        });
      },

      onBackNewModalitaPagamento: function () {
        var self = this;
        var oModelNewModPag = self.getModel("NewModalitaPagamento");
        var oCore = sap.ui.getCore();
        var oBundle = self.getResourceBundle();

        if (oModelNewModPag.getProperty("/VisibleNewModalitaPagamento")) {
          var oDialogNewModPag = oCore.byId("dlgNewModalitaPagamento");
          oDialogNewModPag.close();
          self.unloadFragment();
          this._resetNewModalitaPagamento();
          oModelNewModPag.setProperty("/SZwels", "");
        } else if (oModelNewModPag.getProperty("/VisibleNewQuietanzante")) {
          oModelNewModPag.setProperty("/VisibleNewQuietanzante", false);
          oModelNewModPag.setProperty("/VisibleNewModalitaPagamento", true);
          oModelNewModPag.setProperty(
            "/titleDialog",
            oBundle.getText("titleNewModalitaPagamento")
          );
        } else if (oModelNewModPag.getProperty("/VisibleNewDestinatario")) {
          oModelNewModPag.setProperty("/VisibleNewDestinatario", false);
          oModelNewModPag.setProperty("/VisibleNewModalitaPagamento", true);
          oModelNewModPag.setProperty(
            "/titleDialog",
            oBundle.getText("titleNewModalitaPagamento")
          );
        }
      },

      onNewDestinatario: function () {
        var self = this;
        var oBundle = self.getResourceBundle();
        var oModelNewModPag = self.getModel("NewModalitaPagamento");

        oModelNewModPag.setProperty("/VisibleNewModalitaPagamento", false);
        oModelNewModPag.setProperty("/VisibleNewDestinatario", true);
        oModelNewModPag.setProperty(
          "/titleDialog",
          oBundle.getText("titleNewDestinatario")
        );
      },

      onNewModalitaPagamentoChange: function (oEvent) {
        var self = this;
        var oModelNewModPag = self.getModel("NewModalitaPagamento");

        oModelNewModPag.setProperty(
          "/SZwels",
          oEvent.getParameter("selectedItem").getKey()
        );
        oModelNewModPag.setProperty(
          "/Zdescwels",
          oEvent.getParameter("selectedItem").getText()
        );
        oModelNewModPag.setProperty(
          "/SType",
          oEvent.getParameter("selectedItem").data().SType
        );

        this._resetNewModalitaPagamento();
        this._setNmpPrevalorizzato();
      },

      onNmpPaeseResidenzaChange: function (oEvent) {
        this._setNpmPaeseResidenzaDesc(oEvent.getParameter("value"));
      },

      onNmpTipoFirmaChange: function (oEvent) {
        var self = this;
        var oModelNewModPag = self.getModel("NewModalitaPagamento");

        oModelNewModPag.setProperty(
          "/Ztipofirma",
          oEvent.getParameter("selectedItem")?.getKey()
        );
        oModelNewModPag.setProperty(
          "/DescZtipofirma",
          oEvent.getParameter("selectedItem")?.getText()
        );
      },

      onSaveNewModalitaPagamento: function (oEvent) {
        var self = this;
        var oModelNewModPag = self.getModel("NewModalitaPagamento");
        var oModelSoa = self.getModel("Soa");
        var oModel = self.getModel();
        var oCore = sap.ui.getCore();
        var oDialogNewModPag = oCore.byId("dlgNewModalitaPagamento");

        var oItem = {
          Lifnr: oModelSoa.getProperty("/Lifnr"),
          SType: oModelNewModPag.getProperty("/SType"),
          Pagamento: {
            SZwels: oModelNewModPag.getProperty("/SZwels"),
            Zdescwels: oModelNewModPag.getProperty("/Zdescwels"),
            Zarticolo: oModelNewModPag.getProperty("/Zarticolo"),
            Zcapitolo: oModelNewModPag.getProperty("/Zcapitolo"),
            Zcapo: oModelNewModPag.getProperty("/Zcapo"),
            Gjahr: oModelNewModPag.getProperty("/Gjahr"),
            ValidToDats: oModelNewModPag.getProperty("/ValidToDats")
              ? new Date(oModelNewModPag.getProperty("/ValidToDats"))
              : null,
            ValidFromDats: oModelNewModPag.getProperty("/ValidFromDats")
              ? new Date(oModelNewModPag.getProperty("/ValidFromDats"))
              : null,
            Zcoordest: oModelNewModPag.getProperty("/Zcoordest"),
            Swift: oModelNewModPag.getProperty("/Swift"),
            Ztipofirma: oModelNewModPag.getProperty("/Ztipofirma"),
            SCountryRes: oModelNewModPag.getProperty("/SCountryRes"),
            Seqnr: "",
            SIban: oModelNewModPag.getProperty("/SIban"),
          },
          Quietanzante: {
            Zqtelefono: oModelNewModPag.getProperty("/Quietanzante/Zqtelefono"),
            Zqprovincia: oModelNewModPag.getProperty(
              "/Quietanzante/Zqprovincia"
            ),
            Zqcap: oModelNewModPag.getProperty("/Quietanzante/Zqcap"),
            Zqcitta: oModelNewModPag.getProperty("/Quietanzante/Zqcitta"),
            Zqindiriz: oModelNewModPag.getProperty("/Quietanzante/Zqindiriz"),
            Zqprovnasc: oModelNewModPag.getProperty("/Quietanzante/Zqprovnasc"),
            Zqluogonasc: oModelNewModPag.getProperty(
              "/Quietanzante/Zqluogonasc"
            ),
            Zqdatanasc: oModelNewModPag.getProperty("/Quietanzante/Zqdatanasc")
              ? new Date(
                  oModelNewModPag.getProperty("/Quietanzante/Zqdatanasc")
                )
              : null,
            Stcd1: oModelNewModPag.getProperty("/Quietanzante/Stcd1"),
            Zqqualifica: oModelNewModPag.getProperty(
              "/Quietanzante/Zqqualifica"
            ),
            Zqcognome: oModelNewModPag.getProperty("/Quietanzante/Zqcognome"),
            Zqnome: oModelNewModPag.getProperty("/Quietanzante/Zqnome"),
          },
          DestinatarioVaglia: {
            Zqindirizdest: oModelNewModPag.getProperty(
              "/Destinatario/Zqindirizdest"
            ),
            Zqtelefonodest: oModelNewModPag.getProperty(
              "/Destinatario/Zqtelefonodest"
            ),
            Zqprovinciadest: oModelNewModPag.getProperty(
              "/Destinatario/Zqprovinciadest"
            ),
            Zqcapdest: oModelNewModPag.getProperty("/Destinatario/Zqcapdest"),
            Zqcittadest: oModelNewModPag.getProperty(
              "/Destinatario/Zqcittadest"
            ),
            Zqprovnascdest: oModelNewModPag.getProperty(
              "/Destinatario/Zqprovnascdest"
            ),
            Zqluogonascdest: oModelNewModPag.getProperty(
              "/Destinatario/Zqluogonascdest"
            ),
            Zqdatanascdest: oModelNewModPag.getProperty(
              "/Destinatario/Zqdatanascdest"
            )
              ? new Date(
                  oModelNewModPag.getProperty("/Destinatario/Zqdatanascdest")
                )
              : null,
            Stcd1Dest: oModelNewModPag.getProperty("/Destinatario/Stcd1Dest"),
            Zqqualificadest: oModelNewModPag.getProperty(
              "/Destinatario/Zqqualificadest"
            ),
            Zqcognomedest: oModelNewModPag.getProperty(
              "/Destinatario/Zqcognomedest"
            ),
            Zqnomedest: oModelNewModPag.getProperty("/Destinatario/Zqnomedest"),
          },
        };

        oModel.create("/InserisciModalitaPagamentoSet", oItem, {
          success: function (data, oResponse) {
            if (!self.setResponseMessage(oResponse)) {
              oModelSoa.setProperty("/Zwels", data.Pagamento.SZwels);
              oModelSoa.setProperty("/Iban", data.Pagamento.SIban);
              oModelSoa.setProperty("/Zdescwels", data.Pagamento.Zdescwels);
              oModelSoa.setProperty("/Zbanks", data.Pagamento.SCountryRes);
              oDialogNewModPag.close();
              self.unloadFragment();
              // if (oItem.Quietanzante.Zqcognome) {
              //   //oModelSoa.setProperty("/", oValue)
              // } else if (oItem.DestinatarioVaglia.Zqcognomedest) {
              // }
            }
          },
          error: function (err) {},
        });
      },

      _getNpmModalitaPagamento: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var aFilters = [];

        if (oModelSoa.getProperty("/Lifnr")) {
          aFilters.push(
            new Filter(
              "Lifnr",
              FilterOperator.EQ,
              oModelSoa.getProperty("/Lifnr")
            )
          );

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oModel.read("/NmpModalitaPagamentoSet", {
                filters: aFilters,
                success: function (data, oResponse) {
                  self.setModelCustom("NmpModalitaPagamento", data?.results);
                },
                error: function (error) {},
              });
            });
        }
      },

      _setNpmPaeseResidenzaDesc: function (sPaeseResidenza) {
        var self = this;
        var oModelNewModPagamento = self.getModel("NewModalitaPagamento");

        var oModel = self.getModel();

        var sPath = self.getModel().createKey("NmpPaeseResidenzaDescSet", {
          SCountryRes: sPaeseResidenza,
        });

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oModel.read("/" + sPath, {
              success: function (data, oResponse) {
                oModelNewModPagamento.setProperty(
                  "/DescPaeseResidenza",
                  data?.Descrizione
                );
              },
              error: function () {},
              async: false,
            });
          });
      },

      _resetNewModalitaPagamento: function () {
        var self = this;
        var oModelNewModPag = self.getModel("NewModalitaPagamento");

        oModelNewModPag.setProperty("/SCountryRes", "");
        oModelNewModPag.setProperty("/SIban", "");
        oModelNewModPag.setProperty("/Ztipofirma", "");
        oModelNewModPag.setProperty("/DescZtipofirma", "");
        oModelNewModPag.setProperty("/Swift", "");
        oModelNewModPag.setProperty("/Zcoordest", "");
        oModelNewModPag.setProperty("/ValidFromDats", "");
        oModelNewModPag.setProperty("/ValidToDats", "");
        oModelNewModPag.setProperty("/Gjahr", "");
        oModelNewModPag.setProperty("/Zcapo", "");
        oModelNewModPag.setProperty("/Zcapitolo", "");
        oModelNewModPag.setProperty("/Zarticolo", "");
        oModelNewModPag.setProperty("/Zconto", "");
        oModelNewModPag.setProperty("/ZdescConto", "");
        oModelNewModPag.setProperty("/DescPaeseResidenza", "");

        this._resetQuietanzate();
        this._resetDestinatario();
      },

      _resetQuietanzate: function () {
        var self = this;

        var oModelNewModPag = self.getModel("NewModalitaPagamento");

        var oQuietanzante = oModelNewModPag.getProperty("/Quietanzante");

        oQuietanzante.Zqnome = "";
        oQuietanzante.Zqcognome = "";
        oQuietanzante.Zqqualifica = "";
        oQuietanzante.Stcd1 = "";
        oQuietanzante.Zqdatanasc = "";
        oQuietanzante.Zqluogonasc = "";
        oQuietanzante.Zqprovnasc = "";
        oQuietanzante.Zqindiriz = "";
        oQuietanzante.Zqcitta = "";
        oQuietanzante.Zqcap = "";
        oQuietanzante.Zqprovincia = "";
        oQuietanzante.Zqtelefono = "";

        oModelNewModPag.setProperty("/Quietanzante", oQuietanzante);
      },

      _resetDestinatario: function () {
        var self = this;

        var oModelNewModPag = self.getModel("NewModalitaPagamento");

        var oDestinatario = oModelNewModPag.getProperty("/Destinatario");

        oDestinatario.Zqnomedest = "";
        oDestinatario.Zqcognomedest = "";
        oDestinatario.Zqqualificadest = "";
        oDestinatario.Stcd1Dest = "";
        oDestinatario.Zqdatanascdest = "";
        oDestinatario.Zqluogonascdest = "";
        oDestinatario.Zqprovnascdest = "";
        oDestinatario.Zqindirizdest = "";
        oDestinatario.Zqcittadest = "";
        oDestinatario.Zqcapdest = "";
        oDestinatario.Zqprovinciadest = "";
        oDestinatario.Zqtelefonodest = "";

        oModelNewModPag.setProperty("/Destinatario", oDestinatario);
      },

      _setNmpPrevalorizzato: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelNewModPag = self.getModel("NewModalitaPagamento");
        var sPath = self.getModel().createKey("/NmpPrevalorizzazioneSet", {
          SZwels: oModelNewModPag.getProperty("/SZwels"),
        });

        oModel.read(sPath, {
          success: function (data, oResponse) {
            oModelNewModPag.setProperty("/SCountryRes", data.SCountryRes);
            oModelNewModPag.setProperty(
              "/DescPaeseResidenza",
              data.SCountryResDesc
            );
            oModelNewModPag.setProperty("/ValidFromDats", data.ValidFromDats);
            oModelNewModPag.setProperty("/ValidToDats", data.ValidToDats);
          },
          error: function (error) {},
          async: false,
        });
      },

      //#endregion

      //#region VALUE HELP

      onValueHelpModPagamento: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp." + sFragmentName
        );
        var aFitlers = [];

        if (oModelSoa?.getProperty("/ZzCebenra")) {
          aFitlers.push(
            new Filter(
              "CodEnte",
              FilterOperator.EQ,
              oModelSoa.getProperty("/ZzCebenra")
            )
          );
        }

        if (oModelSoa?.getProperty("/Lifnr")) {
          aFitlers.push(
            new Filter(
              "Lifnr",
              FilterOperator.EQ,
              oModelSoa.getProperty("/Lifnr")
            )
          );
        }

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "ModalitaPagamentoSet", {
              filters: aFitlers,
              success: function (data, oResponse) {
                self.setResponseMessage(oResponse);
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "ModalitaPagamento");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpModPagamentoClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sInput = oSource.data().input;
        var oInputCausaleValutaria = self.getView().byId("iptCausaleValutaria");
        var oInputCoordEstere = self.getView().byId("iptCoordEstere");
        var oInput = self.getView().byId(sInput);
        var sKey = oSelectedItem?.data("key");

        oModelSoa.setProperty("/Zdescwels", oSelectedItem?.getTitle());
        oModelSoa.setProperty("/Zwels", sKey);

        if (sKey !== "ID6") {
          //Resetto il valore di causale valutaria
          oInputCausaleValutaria.resetProperty("value");
          oInputCausaleValutaria.data("key", null);
          oModelSoa.setProperty("/ZCausaleval", "");
          oModelSoa.setProperty("/ZDesccauval", "");
          //Resetto Coordinate estere e BIC
          oModelSoa.setProperty("/Swift", "");
          oModelSoa.setProperty("/Zcoordest", "");
          oInputCoordEstere.resetProperty("value");
          oInputCoordEstere.data("swift", null);
        }

        if (sKey !== "ID1") {
          //Resetto Tipo Firma
          var oInputTipoFirma = self.getView().byId("iptTipoFirma");
          oModelSoa.setProperty("/Ztipofirma", "");

          oInputTipoFirma.setSelectedKey("");
          oInputTipoFirma.setSelectedItem("");
        }

        this.setDatiVaglia();
        this.setInpsData();

        if (!oSelectedItem) {
          oInput.resetProperty("value");
          oInput.data("key", null);
          this.unloadFragment();
          return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        oInput.data("key", sKey);
        this.unloadFragment();
      },

      onValueHelpCausaleValutaria: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();

        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp." + sFragmentName
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "CausaleValutariaSet", {
              success: function (data, oResponse) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "CausaleValutaria");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpCausaleValutariaClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sInput = oSource.data().input;
        var oInput = self.getView().byId(sInput);
        var sKey = oSelectedItem?.data("key");

        oModelSoa.setProperty("/ZDesccauval", oSelectedItem?.getTitle());
        oModelSoa.setProperty("/ZCausaleval", sKey);

        if (!oSelectedItem) {
          oInput.resetProperty("value");
          oInput.data("key", null);
          this.unloadFragment();
          return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        oInput.data("key", sKey);
        this.unloadFragment();
      },

      onValueHelpCoordEstere: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp." + sFragmentName
        );
        var aFilters = [];

        if (oModelSoa?.getProperty("/Lifnr")) {
          aFilters.push(
            new Filter(
              "Lifnr",
              FilterOperator.EQ,
              oModelSoa?.getProperty("/Lifnr")
            )
          );
        }
        if (oModelSoa?.getProperty("/Zwels")) {
          aFilters.push(
            new Filter(
              "Zwels",
              FilterOperator.EQ,
              oModelSoa?.getProperty("/Zwels")
            )
          );
        }

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "CordEstereBenSOASet", {
              filters: aFilters,
              success: function (data, oResponse) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "CoordinateEstere");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpCoordEstereClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sInput = oSource.data().input;
        var oInput = self.getView().byId(sInput);
        var sSwift = oSelectedItem?.data("swift");

        oModelSoa.setProperty("/Zcoordest", oSelectedItem?.getTitle());
        oModelSoa.setProperty("/Swift", sSwift);

        if (!oSelectedItem) {
          oInput.resetProperty("value");
          oInput.data("swift", null);
          this.unloadFragment();
          return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        oInput.data("swift", sSwift);
        this.unloadFragment();
      },

      onValueHelpIban: function (oEvent) {
        var self = this;

        var oDialogMotivazione = self.loadFragment(
          "rgssoa.view.fragment.pop-up.Motivazione"
        );
        oDialogMotivazione.open();
      },

      onOk: function (oEvent) {
        var self = this;
        var sMotivazione = sap.ui.getCore().byId("txtMotivazione")?.getValue();
        var oDialogMotivazione = sap.ui.getCore().byId("dlgMotivazione");

        oDialogMotivazione.close();
        self.unloadFragment();

        if (sMotivazione) {
          //Load Models
          var oDataModel = self.getModel();
          var oModelSoa = self.getModel("Soa");
          var oDialog = self.loadFragment(
            "rgssoa.view.fragment.valueHelp.IbanBeneficiario"
          );
          var aFilters = [];

          if (oModelSoa?.getProperty("/Lifnr")) {
            aFilters.push(
              new Filter(
                "Lifnr",
                FilterOperator.EQ,
                oModelSoa?.getProperty("/Lifnr")
              )
            );
          }

          oModelSoa.setProperty("/Zmotivaz", sMotivazione);

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + "IbanBeneficiarioSOASet", {
                filters: aFilters,
                success: function (data, oResponse) {
                  var oModelJson = new JSONModel();
                  oModelJson.setData(data.results);
                  var oSelectDialog = sap.ui
                    .getCore()
                    .byId("sdIbanBeneficiario");
                  oSelectDialog?.setModel(oModelJson, "IbanBeneficiario");
                  oDialog.open();
                },
                error: function (error) {},
              });
            });
        }
      },

      onClose: function () {
        var self = this;
        var oDialogMotivazione = sap.ui.getCore().byId("dlgMotivazione");
        oDialogMotivazione.close();
        self.unloadFragment();
      },

      onValueHelpIbanClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sInput = oSource.data().input;
        var oInput = self.getView().byId(sInput);
        var oInputCausaleValutaria = self.getView().byId("iptCausaleValutaria");

        oModelSoa.setProperty("/Iban", oSelectedItem?.getTitle());
        oModelSoa.setProperty("/Zbanks", oSelectedItem?.getTitle().slice(0, 2));

        if (
          oModelSoa.getProperty("/Zbanks") === "IT" &&
          oModelSoa.getProperty("/Zwels") !== "ID6"
        ) {
          oModelSoa.setProperty("/ZCausaleval", "");
          oModelSoa.setProperty("/ZDesccauval", "");
          oInputCausaleValutaria.resetProperty("value");
          oInputCausaleValutaria.data("key", null);
        }

        if (!oSelectedItem) {
          oInput.resetProperty("value");
          this.unloadFragment();
          return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        this.unloadFragment();
      },

      onValueHelpCodiceFiscale1Close: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();

        var sInput = oSource.data().input;
        var oInput = self.getView().byId(sInput);

        this._resetCodiceFiscale1();

        if (!oSelectedItem) {
          oInput.resetProperty("value");
          this.unloadFragment();
          return;
        }

        if (oModelSoa.getProperty("/Zwels") === "ID1") {
          oModelSoa.setProperty("/Zstcd1", oSelectedItem?.getTitle());
        } else if (oModelSoa.getProperty("/Zwels") === "ID2") {
          oModelSoa.setProperty("/Zstcd3", oSelectedItem?.getTitle());
        }

        oInput.setValue(oSelectedItem.getTitle());
        this.unloadFragment();
      },

      onValueHelpCodiceFiscale1: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp." + sFragmentName
        );
        var aFilters = [];

        if (oModelSoa?.getProperty("/Lifnr")) {
          aFilters.push(
            new Filter(
              "Lifnr",
              FilterOperator.EQ,
              oModelSoa?.getProperty("/Lifnr")
            )
          );
        }

        if (oModelSoa?.getProperty("/Ztipofirma")) {
          aFilters.push(
            new Filter(
              "TipoFirma",
              FilterOperator.EQ,
              oModelSoa?.getProperty("/Ztipofirma")
            )
          );
        }

        if (oModelSoa?.getProperty("/Zwels")) {
          aFilters.push(
            new Filter(
              "Zwels",
              FilterOperator.EQ,
              oModelSoa?.getProperty("/Zwels")
            )
          );
        }

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "CodFiscUtilizzatoreBenSOASet", {
              filters: aFilters,
              success: function (data, oResponse) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "CodiceFiscale1");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpCodiceFiscale2Close: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sInput = oSource.data().input;
        var oInput = self.getView().byId(sInput);

        this._resetCodiceFiscale2();

        if (!oSelectedItem) {
          oInput.resetProperty("value");
          this.unloadFragment();
          return;
        }

        oModelSoa.setProperty("/Zstcd12", oSelectedItem?.getTitle());

        oInput.setValue(oSelectedItem.getTitle());
        this.unloadFragment();
      },

      onValueHelpCodiceFiscale2: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp." + sFragmentName
        );
        var aFilters = [];

        if (oModelSoa?.getProperty("/Lifnr")) {
          aFilters.push(
            new Filter(
              "Lifnr",
              FilterOperator.EQ,
              oModelSoa?.getProperty("/Lifnr")
            )
          );
        }

        if (oModelSoa?.getProperty("/Ztipofirma")) {
          aFilters.push(
            new Filter(
              "TipoFirma",
              FilterOperator.EQ,
              oModelSoa?.getProperty("/Ztipofirma")
            )
          );
        }

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "CodFiscSecondoQBenSOASet", {
              filters: aFilters,
              success: function (data, oResponse) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "CodiceFiscale2");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpCodiceTributo: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();

        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp." + sFragmentName
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "InpsSOASet", {
              success: function (data) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "CodiceTributo");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpCodiceTributoClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sValue = oSelectedItem?.getTitle() ? oSelectedItem?.getTitle() : "";
        oModelSoa.setProperty("/Zcodtrib", sValue);

        this.unloadFragment();
      },

      //#endregion

      //#region SELECTION CHANGE
      onPaeseResidenzaChange: function (oEvent) {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oInput = self.getView().byId("iptPaeseResidenza");

        oModelSoa.setProperty(
          "/Zbanks",
          oEvent.getParameter("value")
            ? oEvent.getParameter("value").toUpperCase()
            : ""
        );

        oInput.setValue(
          oEvent.getParameter("value")
            ? oEvent.getParameter("value").toUpperCase()
            : ""
        );
      },

      onTipoFirmaChange: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oInput = self.getView().byId("iptTipoFirma");
        oModelSoa.setProperty("/Ztipofirma", oInput.getSelectedKey());
      },

      onSedeBeneficiarioChange: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oInputData = oEvent?.getSource()?.getSelectedItem()?.data();

        oModelSoa.setProperty("/Ort01", oInputData?.Ort01);
        oModelSoa.setProperty("/Regio", oInputData?.Regio);
        oModelSoa.setProperty("/Zlocpag", oInputData?.Regio);
        oModelSoa.setProperty("/Pstlz", oInputData?.Pstlz);
        oModelSoa.setProperty("/Land1", oInputData?.Land1);
      },

      //#endregion

      //#region PRIVATE METHODS

      _setTipoPersona: function () {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");
        var oModelTipoPersona = self.getModel("TipoPersona");

        var sTipoBen = oModelSoa.getProperty("/BuType");

        oModelTipoPersona.setProperty("/PersonaFisica", false);
        oModelTipoPersona.setProperty("/PersonaGiuridica", true);

        if (sTipoBen === "1") {
          oModelTipoPersona.setProperty("/PersonaFisica", true);
          oModelTipoPersona.setProperty("/PersonaGiuridica", false);
        }
      },

      _resetCodiceFiscale1: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oInput = self.getView().byId("iptCodiceFiscale1");

        oModelSoa.setProperty("/ZpersNomeQuiet1", "");
        oModelSoa.setProperty("/ZpersCognomeQuiet1", "");
        oModelSoa.setProperty("/Zstcd1", "");
        oModelSoa.setProperty("/ZpersNomeVaglia", "");
        oModelSoa.setProperty("/ZpersCognomeVaglia", "");
        oModelSoa.setProperty("/Zstcd13", "");
        oModelSoa.setProperty("/Zqindiriz", "");
        oModelSoa.setProperty("/Zqcitta", "");
        oModelSoa.setProperty("/Zqcap", "");
        oModelSoa.setProperty("/Zqprovincia", "");
        oInput.resetProperty("value");
      },

      _resetCodiceFiscale2: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oInput = self.getView().byId("iptCodiceFiscale2");

        oModelSoa.setProperty("/ZpersCognomeQuiet2", "");
        oModelSoa.setProperty("/ZpersNomeQuiet2", "");
        oModelSoa.setProperty("/Zstcd12", "");
        oModelSoa.setProperty("/Zqindiriz12", "");
        oModelSoa.setProperty("/Zqcitta12", "");
        oModelSoa.setProperty("/Zqcap12", "");
        oModelSoa.setProperty("/Zqprovincia12", "");
        oInput.resetProperty("value");
      },

      //#endregion

      //#region PUBLIC METHODS

      setDataBenficiario: function () {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");
        var oDataModel = self.getModel();

        var sLifnr = oModelSoa?.getProperty("/Lifnr")
          ? oModelSoa?.getProperty("/Lifnr")
          : "";
        var sZzCebenra = oModelSoa?.getProperty("/ZzCebenra")
          ? oModelSoa?.getProperty("/ZzCebenra")
          : "";
        var sZzDescebe = oModelSoa?.getProperty("/ZzDescebe")
          ? oModelSoa?.getProperty("/ZzDescebe")
          : "";

        var oParameters = {
          Beneficiario: sLifnr,
          CodEnte: sZzCebenra,
          EnteBen: sZzDescebe,
        };
        var sPath = self
          .getModel()
          .createKey("BeneficiarioSOASet", oParameters);

        this._setTipoPersona();

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + sPath, {
              success: function (data, oResponse) {
                self.setResponseMessage(oResponse);
                oModelSoa.setProperty("/Lifnr", data?.Beneficiario);
                oModelSoa.setProperty("/NameFirst", data?.Nome);
                oModelSoa.setProperty("/NameLast", data?.Cognome);
                oModelSoa.setProperty("/ZzragSoc", data?.RagSoc);
                oModelSoa.setProperty("/TaxnumCf", data?.CodFisc);
                oModelSoa.setProperty("/Taxnumxl", data?.CodFiscEst);
                oModelSoa.setProperty("/TaxnumPiva", data?.PIva);
                oModelSoa.setProperty("/Zidsede", data?.Sede);
                oModelSoa.setProperty("/Zdenominazione", data?.DescrSede);
                oModelSoa.setProperty("/ZzDescebe", data?.EnteBen);
                oModelSoa.setProperty("/Zdurc", data?.Zdurc);
                oModelSoa.setProperty("/ZfermAmm", data?.ZfermAmm);
              },
              error: function (error) {},
            });
          });
      },

      setModalitaPagamento: function () {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        if (oModelSoa?.getProperty("/Witht")) {
          var oInputModalitaPagamento = self
            .getView()
            .byId("iptModalitaPagamento");
          var oParameters = {
            Witht: oModelSoa?.getProperty("/Witht"),
            Text40: oModelSoa?.getProperty("/Text40"),
          };

          var sPath = self
            .getModel()
            .createKey("ModalitaPagamentoSet", oParameters);

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + sPath, {
                success: function (data, oResponse) {
                  oModelSoa.setProperty("/Zwels", data?.Zwels);
                  oInputModalitaPagamento.data("key", data?.Zwels);
                  oModelSoa.setProperty("/Zdescwels", data?.Zdescwels);
                },
                error: function () {},
              });
            });
        }
      },

      setIbanBeneficiario: function () {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var oInputIban = self.getView().byId("iptIbanBeneficiario");

        var aPosizioniSoa = oModelSoa.getProperty("/data");

        var aPosizioniFormatted = aPosizioniSoa.map((oPosizioneSoa) => {
          var oPosizioneFormatted = {
            Anno: oPosizioneSoa.AnnoRegDocumento,
            NumRegDoc: oPosizioneSoa.NumRegDoc,
            TipoDoc: oPosizioneSoa.TipoDoc,
            DataDocBen: oPosizioneSoa.DataDocBen,
            NDocBen: oPosizioneSoa.NDocBen,
            DenBen: oPosizioneSoa.DenBen,
            ImpLiq: oPosizioneSoa.ImpLiq,
            ImpOrd: oPosizioneSoa.ImpOrd,
            ImpDaOrd: oPosizioneSoa.ImpDaOrd,
            Prospetto: oPosizioneSoa.NProspLiquidazione,
            RigaProsp: oPosizioneSoa.RigaProsp,
            Zresvers: oPosizioneSoa.Zresvers,
            Zresesig: oPosizioneSoa.Zresesig,
          };

          return oPosizioneFormatted;
        });

        var oParameters = {
          JSON: JSON.stringify(aPosizioniFormatted),
          CodEnte: oModelSoa?.getProperty("/ZzCebenra"),
          Lifnr: oModelSoa?.getProperty("/Lifnr"),
          DescEnte: oModelSoa?.getProperty("/ZzDescebe"),
          Witht: oModelSoa?.getProperty("/Witht"),
          Text40: oModelSoa?.getProperty("/Text40"),
          Zwels: oModelSoa?.getProperty("/Zwels"),
        };

        oDataModel.callFunction("/SingoloIbanBenSOA", {
          method: "GET",
          urlParameters: oParameters,
          success: function (data, oResponse) {
            oModelSoa.setProperty("/Iban", data?.Iban);
            oInputIban.setValue(data?.Iban);
            oModelSoa.setProperty("/Zbanks", data?.Iban.slice(0, 2));
          },
          error: function (error) {},
        });
      },

      setDatiVaglia: function () {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        //Load Components
        var oInputCodiceFiscale1 = self.getView().byId("iptCodiceFiscale1");
        var oInputCodiceFiscale2 = self.getView().byId("iptCodiceFiscale2");

        var aFilters = [];

        if (oModelSoa.getProperty("/Lifnr")) {
          aFilters.push(
            new Filter(
              "Lifnr",
              FilterOperator.EQ,
              oModelSoa.getProperty("/Lifnr")
            )
          );
        }

        if (oModelSoa.getProperty("/Zwels")) {
          aFilters.push(
            new Filter(
              "Zwels",
              FilterOperator.EQ,
              oModelSoa.getProperty("/Zwels")
            )
          );
        }

        this._resetCodiceFiscale1();
        this._resetCodiceFiscale2();

        if (
          oModelSoa.getProperty("/Zwels") === "ID1" ||
          oModelSoa.getProperty("/Zwels") === "ID2"
        ) {
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + "DatiVagliaBenSOASet", {
                filters: aFilters,
                success: function (data) {
                  var oData = data?.results[0];

                  if (oModelSoa.getProperty("/Zwels") === "ID1") {
                    oModelSoa.setProperty("/ZpersNomeQuiet1", oData?.Zqnome);
                    oModelSoa.setProperty(
                      "/ZpersCognomeQuiet1",
                      oData?.Zqcognome
                    );
                    oModelSoa.setProperty("/Zstcd1", oData?.Zstcd1);
                  } else if (oModelSoa.getProperty("/Zwels") === "ID2") {
                    oModelSoa.setProperty("/ZpersNomeVaglia", oData?.Zqnome);
                    oModelSoa.setProperty(
                      "/ZpersCognomeVaglia",
                      oData?.Zqcognome
                    );
                    oModelSoa.setProperty("/Zstcd13", oData?.Zstcd1);
                  }
                  oModelSoa.setProperty(
                    "/ZpersCognomeQuiet2",
                    oData?.ZpersCognomeQuiet2
                  );
                  oModelSoa.setProperty(
                    "/ZpersNomeQuiet2",
                    oData?.ZpersNomeQuiet2
                  );
                  oInputCodiceFiscale1.setValue(oData?.Zstcd1);
                  oInputCodiceFiscale2.setValue(oData?.Zstcd12);
                  oModelSoa.setProperty("/Zstcd12", oData?.Zstcd12);
                  oModelSoa.setProperty("/Zqindiriz", oData?.Zqindiriz);
                  oModelSoa.setProperty("/Zqcitta", oData?.Zqcitta);
                  oModelSoa.setProperty("/Zqcap", oData?.Zqcap);
                  oModelSoa.setProperty("/Zqprovincia", oData?.Zqprovincia);
                  oModelSoa.setProperty("/Zqindiriz12", oData?.Zqindiriz12);
                  oModelSoa.setProperty("/Zqcitta12", oData?.Zqcitta12);
                  oModelSoa.setProperty("/Zqcap12", oData?.Zqcap12);
                  oModelSoa.setProperty("/Zqprovincia12", oData?.Zqprovincia12);
                },
                error: function (error) {},
              });
            });
        }
      },

      getSedeBeneficiario: function () {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var aFilters = [];

        if (oModelSoa.getProperty("/Lifnr")) {
          aFilters.push(
            new Filter(
              "Lifnr",
              FilterOperator.EQ,
              oModelSoa.getProperty("/Lifnr")
            )
          );
        }

        if (oModelSoa.getProperty("/Witht")) {
          aFilters.push(
            new Filter(
              "CodRitenuta",
              FilterOperator.EQ,
              oModelSoa.getProperty("/Witht")
            )
          );
        }

        if (oModelSoa.getProperty("/ZzCebenra")) {
          aFilters.push(
            new Filter(
              "CodEnte",
              FilterOperator.EQ,
              oModelSoa.getProperty("/ZzCebenra")
            )
          );
        }

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "SedeBeneficiarioSOASet", {
              filters: aFilters,
              success: function (data, oResponse) {
                self.setResponseMessage(oResponse);
                self.setModelCustom("SedeBeneficiario", data?.results);
              },
              error: function (error) {},
            });
          });
      },

      setInpsData: function () {
        var self = this;
        //Load Models
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        oModelSoa.setProperty("/FlagInpsEditabile", false);
        oModelSoa.setProperty("/Zcodprov", "");
        oModelSoa.setProperty("/Zcfcommit", "");
        oModelSoa.setProperty("/Zcodtrib", "");
        oModelSoa.setProperty("/Zperiodrifda", "");
        oModelSoa.setProperty("/Zperiodrifa", "");
        oModelSoa.setProperty("/Zcodinps", "");
        oModelSoa.setProperty("/Zcfvers", "");
        oModelSoa.setProperty("/Zcodvers", "");

        if (oModelSoa.getProperty("/Zwels") === "ID4") {
          var oParameters = {
            Lifnr: oModelSoa.getProperty("/Lifnr"),
            Zwels: oModelSoa.getProperty("/Zwels"),
          };

          var sPath = self.getModel().createKey("InpsSOASet", oParameters);

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oModel.read("/" + sPath, {
                success: function (data) {
                  oModelSoa.setProperty(
                    "/FlagInpsEditabile",
                    data?.FlagInpsEditabile ? true : false
                  );
                  oModelSoa.setProperty("/Zcodprov", data?.Zcodprov);
                },
                error: function () {},
              });
            });
        }
      },

      //#endregion

      //#endregion

      //#region WIZARD 3

      onAddRow: function (oEvent) {
        var self = this;
        var oModelClassificazione = self.getModel("Classificazione");

        var oData = oEvent?.getSource()?.data();
        var aListClassificazione = oModelClassificazione.getProperty(
          "/" + oData?.etichetta
        );

        aListClassificazione.push({
          Zchiavesop: "",
          Bukrs: "",
          Zetichetta: "",
          Zposizione: "",
          ZstepSop: "",
          Zzcig: "",
          Zzcup: "",
          Zcpv: "",
          ZcpvDesc: "",
          Zcos: "",
          ZcosDesc: "",
          Belnr: "",
          ZimptotClass: "0.00",
          Zflagcanc: "",
          ZstatoClass: "",
          Index: aListClassificazione.length,
        });

        oModelClassificazione.setProperty(
          "/" + oData?.etichetta,
          aListClassificazione
        );
      },

      onCancelRow: function (oEvent) {
        var self = this;
        //Load Models
        var oModelClassificazione = self.getModel("Classificazione");

        var oSourceData = oEvent?.getSource()?.data();
        var oTableClassificazione = self.getView().byId(oSourceData?.table);

        var aPathSelectedItems =
          oTableClassificazione.getSelectedContextPaths();

        var aListClassificazione = oModelClassificazione.getProperty(
          "/" + oSourceData?.etichetta
        );

        //Rimuovo i record selezionati
        aPathSelectedItems.map((sPath) => {
          var oItem = oModelClassificazione.getObject(sPath);
          aListClassificazione.splice(aListClassificazione.indexOf(oItem), 1);
        });

        //Resetto l'index
        aListClassificazione.map((oItem, iIndex) => {
          oItem.Index = iIndex;
        });

        //Rimuovo i record selezionati
        oTableClassificazione.removeSelections();

        oModelClassificazione.setProperty(
          "/" + oSourceData?.etichetta,
          aListClassificazione
        );

        //Resetto l'importo totale da associare
        this._setImpTotAssociare(oSourceData?.etichetta);
      },

      //#region VALUE HELP
      onValueHelpCodiceGestionale: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();

        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp." + sFragmentName
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "CodiceGestionaleClassificazioneSet", {
              success: function (data, oResponse) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "CodiceGestionale");
                oSelectDialog?.data("index", oSourceData.index);
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpCodiceGestionaleClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelClassificazione = self.getModel("Classificazione");
        var aListClassificazione =
          oModelClassificazione.getProperty("/CodiceGestionale");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sIndex = oSource.data().index;

        if (!oSelectedItem) {
          this.unloadFragment();
          return;
        }

        aListClassificazione[sIndex].Zcos = oSelectedItem.getTitle();
        aListClassificazione[sIndex].ZcosDesc = oSelectedItem.getDescription();
        oModelClassificazione.setProperty(
          "/CodiceGestionale",
          aListClassificazione
        );

        this.unloadFragment();
      },

      onValueHelpCpv: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();

        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp." + sFragmentName
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "CPVClassificazioneSet", {
              success: function (data, oResponse) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "Cpv");
                oSelectDialog?.data("index", oSourceData.index);
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpCpvClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelClassificazione = self.getModel("Classificazione");
        var aListClassificazione = oModelClassificazione.getProperty("/Cpv");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sIndex = oSource.data().index;

        if (!oSelectedItem) {
          this.unloadFragment();
          return;
        }

        aListClassificazione[sIndex].Zcpv = oSelectedItem.getTitle();
        aListClassificazione[sIndex].ZcpvDesc = oSelectedItem.getDescription();
        oModelClassificazione.setProperty("/Cpv", aListClassificazione);

        this.unloadFragment();
      },
      //#endregion

      //#region SELECTION CHANGE

      onImpDaAssociareChange: function (oEvent) {
        var self = this;
        var oSourceData = oEvent.getSource().data();
        //Load Models
        var oModelClassificazione = self.getModel("Classificazione");

        var sValue = oEvent.getParameter("value");
        var aListClassificazione = oModelClassificazione.getProperty(
          "/" + oSourceData?.etichetta
        );

        aListClassificazione[oSourceData?.index].ZimptotClass =
          parseFloat(sValue).toFixed(2);

        oModelClassificazione.setProperty(
          "/" + oSourceData?.etichetta,
          aListClassificazione
        );

        this._setImpTotAssociare(oSourceData?.etichetta);
      },

      //#region PRIVATE METHODS
      _setImpTotAssociare: function (sEtichetta) {
        var self = this;
        //Load Models
        var oModelClassificazione = self.getModel("Classificazione");

        var aListClassificazione = oModelClassificazione.getProperty(
          "/" + sEtichetta
        );

        var iTotalImpDaAssociare = 0;
        aListClassificazione.map((oItem) => {
          iTotalImpDaAssociare += parseFloat(oItem.ZimptotClass);
        });

        oModelClassificazione.setProperty(
          "/ImpTotAssociare" + sEtichetta,
          parseFloat(iTotalImpDaAssociare).toFixed(2)
        );
      },
      //#endregion

      //#endregion

      //#region PRIVATE METHODS
      _checkClassificazione: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oModelClassificazione = self.getModel("Classificazione");
        var oBundle = self.getResourceBundle();

        var aListCodiceGestionale =
          oModelClassificazione.getProperty("/CodiceGestionale");
        var aListCpv = oModelClassificazione.getProperty("/Cpv");
        var aListCig = oModelClassificazione.getProperty("/Cig");
        var aListCup = oModelClassificazione.getProperty("/Cup");

        //Controllo se sono stati inseriti i Codici Gestionali
        if (aListCodiceGestionale?.length === 0) {
          sap.m.MessageBox.error(
            oBundle.getText("msgCodiceGestionaleRequired")
          );
          return false;
        }

        //Controllo se i codici sono stati inseriti
        if (this._checkCodiceClassificazione(aListCodiceGestionale, "Zcos")) {
          sap.m.MessageBox.error(oBundle.getText("msgNoZcos"));
          return false;
        }

        //Controllo se i codici sono stati inseriti
        if (this._checkCodiceClassificazione(aListCpv, "Zcpv")) {
          sap.m.MessageBox.error(oBundle.getText("msgNoZcpv"));
          return false;
        }

        //Controllo se i codici sono stati inseriti
        if (this._checkCodiceClassificazione(aListCig, "Zzcig")) {
          sap.m.MessageBox.error(oBundle.getText("msgNoZcig"));
          return false;
        }

        //Controllo se i codici sono stati inseriti
        if (this._checkCodiceClassificazione(aListCup, "Zzcup")) {
          sap.m.MessageBox.error(oBundle.getText("msgNoZcup"));
          return false;
        }

        //Controllo gli importi
        var aListClassificazione = this._getClassificazioneList();

        var bImpZero = false;
        aListClassificazione.map((oClassificazioe) => {
          if (oClassificazioe.ZimptotClass === "0.00") {
            bImpZero = true;
          }
        });

        if (bImpZero) {
          sap.m.MessageBox.error(oBundle.getText("msgImportiZero"));
          return false;
        }

        //Controllo il totale degli importi con l'importo associato
        var iImpAssociato = parseFloat(oModelSoa.getProperty("/Zimptot"));
        var iImpAssociatoCodiceGestione = parseFloat(
          oModelClassificazione.getProperty("/ImpTotAssociareCodiceGestionale")
        );
        var iImpCpv = parseFloat(
          oModelClassificazione.getProperty("/ImpTotAssociareCpv")
        );
        var iImpCig = parseFloat(
          oModelClassificazione.getProperty("/ImpTotAssociareCig")
        );
        var iImpCup = parseFloat(
          oModelClassificazione.getProperty("/ImpTotAssociareCup")
        );

        var iTotaImpAssociato =
          iImpAssociatoCodiceGestione + iImpCpv + iImpCig + iImpCup;

        if (iImpAssociato !== iTotaImpAssociato) {
          sap.m.MessageBox.error(
            oBundle.getText(
              "msgDifferentImpAssociato",
              formatter.convertFormattedNumber(
                parseFloat(iImpAssociato).toFixed(2)
              )
            )
          );
          return false;
        }

        oModelSoa.setProperty("/Classificazione", aListClassificazione);
        return true;
      },

      _getClassificazioneList: function () {
        var self = this;
        var oModelClassificazione = self.getModel("Classificazione");

        var aListCodiceGestionale =
          oModelClassificazione.getProperty("/CodiceGestionale");
        var aListCpv = oModelClassificazione.getProperty("/Cpv");
        var aListCig = oModelClassificazione.getProperty("/Cig");
        var aListCup = oModelClassificazione.getProperty("/Cup");

        var aListClassificazione = [];

        aListCodiceGestionale.map((oCodiceGestionale) => {
          delete oCodiceGestionale.Index;
          aListClassificazione.push(oCodiceGestionale);
        });

        aListCpv.map((oCpv) => {
          delete oCpv.Index;
          aListClassificazione.push(oCpv);
        });

        aListCig.map((oCig) => {
          delete oCig.Index;
          aListClassificazione.push(oCig);
        });

        aListCup.map((oCup) => {
          delete oCup.Index;
          aListClassificazione.push(oCup);
        });

        return aListClassificazione;
      },

      _checkCodiceClassificazione: function (aList, sCodice) {
        var bCodiceEmpty = false;
        if (aList.length !== 0) {
          aList.map((oItem) => {
            if (!oItem[sCodice]) {
              bCodiceEmpty = true;
            }
          });
        }

        return bCodiceEmpty;
      },

      //#endregion

      //#endregion

      //#region WIZARD 4
      onSave: function () {},

      //#region PRIVATE METHODS

      setCausalePagamento: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        var aListDocumenti = oModelSoa.getProperty("/data");
        var sZtipopag = oModelSoa.getProperty("/Ztipopag");

        var sZcausale = "";
        if (sZtipopag === "1" || sZtipopag === "2") {
          aListDocumenti.map((oDocumento) => {
            sZcausale =
              sZcausale +
              " " +
              oDocumento.NumRegDoc +
              " " +
              formatter.dateWithPoints(oDocumento.DataDocBen);
          });
        }

        oModelSoa.setProperty("/Zcausale", sZcausale);
      },

      //#endregion

      //#endregion
    });
  }
);
