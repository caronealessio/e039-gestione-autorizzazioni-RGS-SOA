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

    const PAGINATOR_MODEL = "paginatorModel";
    return BaseController.extend("rgssoa.controller.SoaScenario1", {
      formatter: formatter,
      onInit: function () {
        var self = this;
        var oStepScenario = new JSONModel({
          wizard1Step1: true,
          wizard1Step2: false,
          wizard1Step3: false,
          wizard2: false,
          wizard3: false,
          wizard4: false,
          visibleBtnForward: false,
          visibleBtnStart: true,
        });

        var oRiepilogoQuoteDocumenti = new JSONModel({
          data: [],
          totalImpDaOrd: "0.00",
        });

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

        var oInputImpDaOrd = self.getView().byId("iptImpDaOrd");
        oInputImpDaOrd.attachBrowserEvent(
          "keypress",
          formatter.acceptOnlyNumbers
        );

        self.setModel(oModelPaginator, PAGINATOR_MODEL);
        self.setModel(oRiepilogoQuoteDocumenti, "RiepilogoQuoteDocumenti");
        self.setModel(oStepScenario, "StepScenario");

        this.getRouter()
          .getRoute("soaScenario1")
          .attachPatternMatched(this._onObjectMatched, this);
      },

      onBeforeRendering: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oInputUffContabile = self.getView().byId("fltUfficioContabile");
        var oInputUffPagatore = self.getView().byId("fltUfficioPagatore");

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "PrevalUfficioContabileSet", {
              success: function (data) {
                oInputUffContabile.setValue(data?.results[0]?.Fkber);
                oInputUffPagatore.setValue(data?.results[0]?.Fkber);
                oInputUffContabile.data("key", data?.results[0]?.Fkber);
                oInputUffPagatore.data("key", data?.results[0]?.Fkber);
              },
              error: function (error) {},
            });
          });
      },

      onNavBack: function () {
        var self = this;
        var oView = self.getView();
        var oWizard = oView.byId("wizScenario1");
        //Load Models
        var oStepScenarioModel = self.getModel("StepScenario");
        var oModelRiepilogo = self.getModel("RiepilogoQuoteDocumenti");
        var oModelSoaDetail = self.getModel("SoaDetail");

        var bWizard1Step1 = oStepScenarioModel.getProperty("/wizard1Step1");
        var bWizard1Step2 = oStepScenarioModel.getProperty("/wizard1Step2");
        var bWizard1Step3 = oStepScenarioModel.getProperty("/wizard1Step3");
        var bWizard2 = oStepScenarioModel.getProperty("/wizard2");
        var bWizard3 = oStepScenarioModel.getProperty("/wizard3");
        var bWizard4 = oStepScenarioModel.getProperty("/wizard4");

        if (bWizard1Step1) {
          history.go(-1);
        } else if (bWizard1Step2) {
          oStepScenarioModel.setProperty("/wizard1Step2", false);
          oStepScenarioModel.setProperty("/wizard1Step1", true);
          oStepScenarioModel.setProperty("/visibleBtnForward", false);
          oStepScenarioModel.setProperty("/visibleBtnStart", true);
          oModelRiepilogo.setProperty("/data", []);
        } else if (bWizard1Step3) {
          oStepScenarioModel.setProperty("/wizard1Step3", false);
          oStepScenarioModel.setProperty("/wizard1Step2", true);
          oModelSoaDetail.setProperty("/Zimptot", "0.00");
        } else if (bWizard2) {
          oStepScenarioModel.setProperty("/wizard2", false);
          oStepScenarioModel.setProperty("/wizard1Step3", true);
          oWizard.previousStep();
        } else if (bWizard3) {
          oStepScenarioModel.setProperty("/wizard3", false);
          oStepScenarioModel.setProperty("/wizard2", true);
          oWizard.previousStep();
        } else if (bWizard4) {
          oStepScenarioModel.setProperty("/wizard4", false);
          oStepScenarioModel.setProperty("/wizard3", true);
          oWizard.previousStep();
        }
      },

      onNavForward: function () {
        var self = this;
        var oWizard = self.getView().byId("wizScenario1");
        var oStepScenarioModel = self.getModel("StepScenario");
        var oModelRiepilogo = self.getModel("RiepilogoQuoteDocumenti");
        var oModelSoaDetail = self.getModel("SoaDetail");
        var oBundle = self.getResourceBundle();

        var bWizard1Step2 = oStepScenarioModel.getProperty("/wizard1Step2");
        var bWizard1Step3 = oStepScenarioModel.getProperty("/wizard1Step3");
        var bWizard2 = oStepScenarioModel.getProperty("/wizard2");
        var bWizard3 = oStepScenarioModel.getProperty("/wizard3");

        if (bWizard1Step2) {
          if (
            oModelRiepilogo.getProperty("/data").length === 0 ||
            oModelRiepilogo.getProperty("/totalImpDaOrd") === "0.00"
          ) {
            sap.m.MessageBox.error(oBundle.getText("msgNoDocuments"));
          } else {
            oStepScenarioModel.setProperty("/wizard1Step2", false);
            oStepScenarioModel.setProperty("/wizard1Step3", true);
            oModelSoaDetail.setProperty(
              "/Zimptot",
              oModelRiepilogo.getProperty("/totalImpDaOrd")
            );
          }
        } else if (bWizard1Step3) {
          oStepScenarioModel.setProperty("/wizard1Step3", false);
          oStepScenarioModel.setProperty("/wizard2", true);
          oWizard.nextStep();
        } else if (bWizard2) {
          oStepScenarioModel.setProperty("/wizard2", false);
          oStepScenarioModel.setProperty("/wizard3", true);
          oWizard.nextStep();
        } else if (bWizard3) {
          oStepScenarioModel.setProperty("/wizard3", false);
          oStepScenarioModel.setProperty("/wizard4", true);
          oWizard.nextStep();
        }
      },

      //#region WIZARD 1

      onStart: function () {
        this._setPaginatorProperties();
        this._getQuoteDocumentiList();
      },

      onSelectedItem: function (oEvent) {
        var self = this;
        var bSelected = oEvent.getParameter("selected");
        //Load Model
        var oModelDocumenti = self.getModel("QuoteDocumenti");
        var oModelRiepilogo = self.getModel("RiepilogoQuoteDocumenti");
        //Load Component
        var oTableDocumenti = self.getView().byId("tblQuoteDocumenti");
        var oButtonCalculate = self.getView().byId("btnCalculate");

        var aListRiepilogo = oModelRiepilogo.getProperty("/data");
        var aTableItems = oTableDocumenti.getItems();
        var aSelectedItems = oTableDocumenti.getSelectedItems();

        if (bSelected) {
          aSelectedItems.map((oSelectedItem) => {
            //Prendo i record selezionati
            var oItem = oModelDocumenti.getObject(
              oSelectedItem.getBindingContextPath()
            );

            var bExist = false;
            //Controllo se esiste già in lista, l'includes non funziona non so perchè
            aListRiepilogo.map((oRecord) => {
              if (
                oRecord.Bukrs === oItem.Bukrs &&
                oRecord.NProspLiquidazione === oItem.NProspLiquidazione &&
                oRecord.RigaProsp === oItem.RigaProsp &&
                oRecord.Zversione === oItem.Zversione &&
                oRecord.ZversioneOrig === oItem.ZversioneOrig
              ) {
                bExist = true;
              }
            });
            //Se non esiste lo aggiungo alla lista di riepilogo
            !bExist && aListRiepilogo.push(oItem);
          });
        } else {
          var aNotSelectedItems = [];

          //Inserisco in un array temporaneo i record della pagina corrente della tabella
          //che non sono selezionati
          aTableItems.map((oTableItem) => {
            !aSelectedItems.includes(oTableItem) &&
              aNotSelectedItems.push(oTableItem);
          });

          //Controllo l'esistenza dei record non selezionati nell'array dei record selezionati
          //Se ci sono record che corrispondono vengono eliminati
          aNotSelectedItems.map((oNotSelectedItem) => {
            //L'input dell'Importo da Ordinare dei record non selezionati viene rimesso
            //a editabile
            var oItem = oModelDocumenti.getObject(
              oNotSelectedItem.getBindingContextPath()
            );
            aListRiepilogo = aListRiepilogo.filter((oSelectedItem) => {
              return !(
                oSelectedItem.Bukrs === oItem.Bukrs &&
                oSelectedItem.NProspLiquidazione === oItem.NProspLiquidazione &&
                oSelectedItem.RigaProsp === oItem.RigaProsp &&
                oSelectedItem.Zversione === oItem.Zversione &&
                oSelectedItem.ZversioneOrig === oItem.ZversioneOrig
              );
            });
          });
        }

        oButtonCalculate.setVisible(aListRiepilogo.length !== 0);
        oModelRiepilogo.setProperty("/totalImpDaOrd", "0.00");
        oModelRiepilogo.setProperty("/data", aListRiepilogo);
      },

      onCalcute: function () {
        var self = this;
        var oModelRiepilogo = self.getModel("RiepilogoQuoteDocumenti");
        var aListRiepilogo = oModelRiepilogo.getProperty("/data");
        var fTotal = 0;

        aListRiepilogo.map((oSelectedItem) => {
          fTotal += parseFloat(oSelectedItem?.ImpDaOrd);
        });

        oModelRiepilogo.setProperty("/totalImpDaOrd", fTotal.toFixed(2));
      },

      //#region VALUE HELP

      onValueHelpRitenuta: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.openDialog(
          "rgssoa.view.fragment.valueHelp.ricercaPosizioni." + sFragmentName
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
        var oDialog = self.openDialog(
          "rgssoa.view.fragment.valueHelp.ricercaPosizioni." + sFragmentName
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
        var oModelSoaDetail = self.getModel("SoaDetail");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sInput = oSource.data().input;
        var oInput = self.getView().byId(sInput);
        var sKey = oSelectedItem?.data("key");

        this._setEditableBeneficiario(oSelectedItem);
        oModelSoaDetail.setProperty("/Text40", oSelectedItem?.getTitle());

        if (!oSelectedItem) {
          oInput.resetProperty("value");
          oInput.data("key", null);
          this.closeDialog();
          return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        oInput.data("key", sKey);
        this.closeDialog();
      },

      onValueHelpEnteBeneficiarioClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoaDetail = self.getModel("SoaDetail");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sInput = oSource.data().input;
        var oInput = self.getView().byId(sInput);
        var sKey = oSelectedItem?.data("key");

        this._setEditableBeneficiario(oSelectedItem);
        oModelSoaDetail.setProperty("/ZzDescebe", oSelectedItem?.getTitle());

        if (oSelectedItem) {
          this._setSpecieSoaDesc("2");
        } else {
          oInput.resetProperty("value");
          oModelSoaDetail.setProperty("/DescZspecieSop", null);
          oInput.data("key", null);
          this.closeDialog();
          return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        oInput.data("key", sKey);
        this.closeDialog();
      },

      onValueHelpBeneficiario: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.openDialog(
          "rgssoa.view.fragment.valueHelp.ricercaPosizioni." + sFragmentName
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
        var oModelSoaDetail = self.getModel("SoaDetail");

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
        oModelSoaDetail.setProperty("/NameFirst", oSelectedItem?.data("name"));
        oModelSoaDetail.setProperty(
          "/NameLast",
          oSelectedItem?.data("surname")
        );
        oModelSoaDetail.setProperty(
          "/ZzragSoc",
          oSelectedItem?.data("ragSociale")
        );
        oModelSoaDetail.setProperty(
          "/TaxnumCf",
          oSelectedItem?.data("codFiscale")
        );
        oModelSoaDetail.setProperty("/TaxnumPiva", oSelectedItem?.data("pIva"));

        oView.setModel(oBeneficiario, "Beneficiario");
        this._setEditableRitenuta(oSelectedItem);

        if (oSelectedItem) {
          this._setSpecieSoaDesc("1");
        } else {
          oInput.resetProperty("value");
          oModelSoaDetail.setProperty("/DescZspecieSop", null);
          self.clearModel("AnnoDocBeneficiario");
          self.closeDialog();
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

        self.closeDialog();
      },

      onValueHelpNProspLiquidazione: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.openDialog(
          "rgssoa.view.fragment.valueHelp.ricercaPosizioni." + sFragmentName
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
        var oDialog = self.openDialog(
          "rgssoa.view.fragment.valueHelp.ricercaPosizioni." + sFragmentName
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
        var oDialog = self.openDialog(
          "rgssoa.view.fragment.valueHelp.ricercaPosizioni." + sFragmentName
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

      onValueHelpUffContabile: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.openDialog(
          "rgssoa.view.fragment.valueHelp.ricercaPosizioni." + sFragmentName
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
        var oDialog = self.openDialog(
          "rgssoa.view.fragment.valueHelp.ricercaPosizioni." + sFragmentName
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
        var oDialog = self.openDialog(
          "rgssoa.view.fragment.valueHelp.ricercaPosizioni." + sFragmentName
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
        var oDialog = self.openDialog(
          "rgssoa.view.fragment.valueHelp.ricercaPosizioni." + sFragmentName
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
        this._setEditableRitenuta(oEvent.getParameter("value"));
      },

      onDataEseChange: function (oEvent) {
        this._setEditableBeneficiario(oEvent.getParameter("value"));
      },

      onImpDaOrdinareChange: function (oEvent) {
        var self = this;
        //Load Component
        var oTableDocumenti = self.getView().byId("tblQuoteDocumenti");
        //Load Models
        var oTableModelDocumenti = oTableDocumenti.getModel("QuoteDocumenti");
        var oModelRiepilogo = self.getModel("RiepilogoQuoteDocumenti");

        var sValue = oEvent.getParameter("value");
        oModelRiepilogo.setProperty("/totalImpDaOrd", "0.00");

        oTableModelDocumenti.getObject(
          oEvent.getSource().getParent().getBindingContextPath()
        ).ImpDaOrd = parseFloat(sValue).toFixed(2);
      },
      //#endregion SELECTION CHANGE

      //#region PAGINATOR
      onFirstPaginator: function () {
        var self = this;

        self.getFirstPaginator(PAGINATOR_MODEL);
        this._getQuoteDocumentiList();
      },

      onLastPaginator: function () {
        var self = this;

        self.getLastPaginator(PAGINATOR_MODEL);
        this._getQuoteDocumentiList();
      },

      onChangePage: function (oEvent) {
        var self = this;

        self.getChangePage(oEvent, PAGINATOR_MODEL);
        this._getQuoteDocumentiList();
      },
      //#endregion PAGINATOR

      //#region PRIVATE METHODS
      _getPositionsFilters: function () {
        var self = this;
        var aFilters = [];
        var oView = self.getView();
        var oSoaDetailModel = self.getModel("SoaDetail");

        var oRitenuta = oView.byId("fltRitenuta");
        var oEnteBeneficiario = oView.byId("fltEnteBeneficiario");
        var oQuoteEsigibili = oView.byId("fltQuoteEsigibili");
        var oDataEsigibilitaFrom = oView.byId("fltDataEsigibilitaFrom");
        var oDataEsigibilitaTo = oView.byId("fltDataEsigibilitaTo");
        var oTipoBeneficiario = oView.byId("fltTipoBeneficiario");
        var oBeneficiario = oView.byId("fltBeneficiario");
        var oEseContabile = oView.byId("fltEseContabile");
        var oUffLiquidatore = oView.byId("fltUffLiquidatore");
        var oNProspLiquidazioneFrom = oView.byId("fltNProspLiquidazioneFrom");
        var oNProspLiquidazioneTo = oView.byId("fltNProspLiquidazioneTo");
        var oDescProspLiquidazione = oView.byId("fltZdescProsp");
        var oUfficioContabile = oView.byId("fltUfficioContabile");
        var oUfficioPagatore = oView.byId("fltUfficioPagatore");
        var oAnnoRegDocumento = oView.byId("fltAnnoRegDoc");
        var oNRegDocumentoFrom = oView.byId("fltNRegDocFrom");
        var oNRegDocumentoTo = oView.byId("fltNRegDocTo");
        var oAnnoDocBeneficiario = oView.byId("fltAnnoDocBene");
        var oNDocBeneficiario = oView.byId("fltNDocBene");
        var oCIG = oView.byId("fltCIG");
        var oCUP = oView.byId("fltCUP");
        var oScadenzaDocFrom = oView.byId("fltScadenzaDocFrom");
        var oScadenzaDocTo = oView.byId("fltScadenzaDocTo");

        self.setFilterEQKeyMC(aFilters, oRitenuta);
        self.setFilterEQKeyMC(aFilters, oEnteBeneficiario);
        if (oQuoteEsigibili.getSelected()) {
          aFilters.push(
            new Filter(
              oQuoteEsigibili.data("searchPropertyModel"),
              FilterOperator.EQ,
              true
            )
          );
        }
        self.setFilterMultiInputEQText(aFilters, oUffLiquidatore);
        self.setFilterEQValue(aFilters, oDescProspLiquidazione);
        self.setFilterBTValue(
          aFilters,
          oDataEsigibilitaFrom,
          oDataEsigibilitaTo
        );
        self.setFilterEQKey(aFilters, oTipoBeneficiario);
        self.setFilterEQValue(aFilters, oBeneficiario);
        self.setFilterEQKey(aFilters, oEseContabile);
        self.setFilterBTValue(
          aFilters,
          oNProspLiquidazioneFrom,
          oNProspLiquidazioneTo
        );
        self.setFilterEQKeyMC(aFilters, oUfficioContabile);
        self.setFilterEQKeyMC(aFilters, oUfficioPagatore);
        self.setFilterBTValue(aFilters, oNRegDocumentoFrom, oNRegDocumentoTo);
        self.setFilterMultiInputEQText(aFilters, oNDocBeneficiario);
        self.setFilterEQValue(aFilters, oCIG);
        self.setFilterEQValue(aFilters, oCUP);
        self.setFilterBTValue(aFilters, oScadenzaDocFrom, oScadenzaDocTo);
        self.setFilterMultiComboBoxEQKey(aFilters, oAnnoRegDocumento);
        self.setFilterMultiComboBoxEQKey(aFilters, oAnnoDocBeneficiario);

        aFilters.push(
          new Filter(
            "Fipex",
            FilterOperator.EQ,
            oSoaDetailModel?.getProperty("/Fipos")
          )
        );
        aFilters.push(
          new Filter(
            "Fistl",
            FilterOperator.EQ,
            oSoaDetailModel?.getProperty("/Fistl")
          )
        );

        return aFilters;
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

      _setPaginatorProperties: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oFilters = this._getPositionsFilters();
        var oPaginatorModel = self.getModel(PAGINATOR_MODEL);

        self.resetPaginator(oPaginatorModel);
        var iNumRecordsForPage =
          oPaginatorModel.getProperty("/numRecordsForPage");

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "QuoteDocumentiSet" + "/$count", {
              filters: oFilters,
              success: function (data) {
                self.setPaginatorProperties(
                  oPaginatorModel,
                  data,
                  iNumRecordsForPage
                );
              },
              error: function () {},
            });
          });
      },

      _getQuoteDocumentiList: function () {
        var self = this;
        var oView = self.getView();
        //Load Model
        var oDataModel = self.getModel();
        var oStepScenarioModel = self.getModel("StepScenario");
        var oPaginatorModel = self.getModel(PAGINATOR_MODEL);
        var oModelRiepilogo = self.getModel("RiepilogoQuoteDocumenti");
        //Load Component
        var oPanelPaginator = oView.byId("pnlPaginator");
        var oTableDocumenti = oView.byId("tblQuoteDocumenti");
        var oPanelCalculator = oView.byId("pnlCalculatorList");

        var aListRiepilogo = oModelRiepilogo.getProperty("/data");
        var aFilters = this._getPositionsFilters();
        var urlParameters = {
          $top: oPaginatorModel.getProperty("/numRecordsForPage"),
          $skip: oPaginatorModel.getProperty("/paginatorSkip"),
        };

        //Check BEETWEN filters
        var sIntervalFilter = self.checkBTFilter(aFilters);
        if (sIntervalFilter) {
          sap.m.MessageBox.error(sIntervalFilter);
          self.clearModel("QuoteDocumenti");
          return;
        }

        oView.setBusy(true);

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "QuoteDocumentiSet", {
              urlParameters: urlParameters,
              filters: aFilters,
              success: function (data, oResponse) {
                if (!self.setResponseMessage(oResponse)) {
                  oStepScenarioModel.setProperty("/wizard1Step1", false);
                  oStepScenarioModel.setProperty("/wizard1Step2", true);
                  oStepScenarioModel.setProperty("/visibleBtnForward", true);
                  oStepScenarioModel.setProperty("/visibleBtnStart", false);
                }
                self.setModelCustom("QuoteDocumenti", data.results);

                oPanelPaginator.setVisible(data.results.length !== 0);
                oPanelCalculator.setVisible(data.results.length !== 0);

                if (data.results !== 0) {
                  data.results.map((oItem, iIndex) => {
                    //Vengono selezionati i record quando viene caricata l'entità
                    aListRiepilogo.map((oSelectedItem) => {
                      if (
                        oItem.Bukrs === oSelectedItem.Bukrs &&
                        oItem.NProspLiquidazione ===
                          oSelectedItem.NProspLiquidazione &&
                        oItem.RigaProsp === oSelectedItem.RigaProsp &&
                        oItem.Zversione === oSelectedItem.Zversione &&
                        oItem.ZversioneOrig === oSelectedItem.ZversioneOrig
                      ) {
                        oTableDocumenti.setSelectedItem(
                          oTableDocumenti.getItems()[iIndex]
                        );
                      }
                    });
                  });
                }
                oView.setBusy(false);
              },
              error: function (error) {
                oView.setBusy(false);
              },
            });
          });
      },

      _setSpecieSoaDesc: function (sValue) {
        var self = this;
        //Load Models
        var oModel = self.getModel();
        var oModelSoaDetail = self.getModel("SoaDetail");

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
                oModelSoaDetail.setProperty(
                  "/DescZspecieSop",
                  data?.ZdescSpecieSoa
                );
              },
              error: function () {},
            });
          });
      },

      //#endregion PRIVATE METHODS

      //#endregion

      //#region WIZARD 2

      //#endregion
    });
  }
);
