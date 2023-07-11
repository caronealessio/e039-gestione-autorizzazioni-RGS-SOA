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

        var oModelSoa = new JSONModel({
          //Dati SOA (Parte celeste in alto)
          Gjahr: "", //Esercizio di gestione
          Zimptot: "0.00", //Importo
          Zzamministr: "", //Amministrazione
          ZufficioCont: "", //Ufficio Contabile
          NameFirst: "", //Nome Beneficiairo
          NameLast: "", //Cognome Beneficiario
          ZzragSoc: "", //Ragione Sociale
          TaxnumCf: "", //Codice Fiscale
          TaxnumPiva: "", //Partita Iva
          Fipos: "", //Posizione Finanziaria
          Fistl: "", //Struttura Amministrativa Responsabile
          Lifnr: "", //Beneficiario
          Witht: "", //Codice Ritenuta
          Text40: "", //Descrizione Ritenuta
          ZzCebenra: "", //Codice Ente Beneficiario
          ZzDescebe: "", //Descrizione Ente Beneficiario
          Zchiaveaut: "", //Identificativo Autorizzazione
          Ztipodisp2: "", //Codice Tipologia Autorizzazione
          Zdesctipodisp2: "", //Tipologia Autorizzazione
          Ztipodisp3: "", //Codice Tipologia Disponibilità
          Zdesctipodisp3: "", //Tipologia Disponibilità
          Zimpaut: "", //Importo autorizzato
          Zimpdispaut: "", //Disponibilità autorizzazione
          Zztipologia: "", //Tipololgia SOA
          DescZztipologia: "", //Descrizione Tipologia SOA
          Zfunzdel: "", //Codice FD
          Zdescriz: "", //TODO - Open Point - Descrizione Codice FD
          ZspecieSop: "", //Specie SOA
          DescZspecieSop: "", //Descrizione Specie SOA
          Zidsede: "", //Sede
          Zwels: "", //Codice Modalità Pagamento
          ZCausaleval: "", //Causale Valutaria
          Swift: "", //BIC
          Zcoordest: "", //Cordinate Estere
          Iban: "", //IBAN
          Ztipofirma: "", //Tipologia Firma
          ZpersCognomeQuiet1: "", //Cognome primo quietanzante
          ZpersCognomeQuiet2: "", //Cognome secondo quietanzante
          ZpersNomeQuiet1: "", //Nome primo quietanzante
          ZpersNomeQuiet2: "", //Nome secondo quietanzante
          ZpersNomeVaglia: "", //Nome persona vaglia
          ZpersCognomeVaglia: "", //Cognome persona vaglia
          Zstcd1: "", //Codice Fiscale Utilizzatore
          Zstcd12: "", //Codice fiscale secondo quietanzante
          Zstcd13: "", //Codice fiscale destinatario vaglia
          Zcodprov: "", //INPS - Codice Provenienza
          Zcfcommit: "", //INPS - Codice Fiscale Committente
          Zcodtrib: "", //INPS - Codice tributo
          Zperiodrifda: "", //INPS - Periodo riferimento da
          Zperiodrifa: "", //INPS - Periodo riferimento a
          Zcodinps: "", //INPS - Matricola INPS/Codice INPS/Filiale azienda
          Zcfvers: "", //INPS - Codice Fiscale Versante
          Zcodvers: "", //INPS - Codice Versante
          data: [],

          BuType: "", //Tipologia Persona
          Taxnumxl: "", //Codice Fiscale Estero
          Zdenominazione: "", //Descrizione Sede
          Zdurc: "", //Numero identificativo Durc
          ZfermAmm: "", //Fermo amministrativo
          Zdescwels: "", //Descrizione Modalità Pagamento
          Zbanks: "", //Paese di Residenza (Primi 2 digit IBAN)
          ZDesccauval: "", //Descrizione Causale Valutaria

          Zqindiriz: "", //Indirizzo primo quietanzante
          Zqcitta: "", //Citta primo quietanzantez
          Zqcap: "", //Cap primo quietanzante
          Zqprovincia: "", //Provincia primo quietanzante
          Zqindiriz12: "", //Indirizzo secondo quietanzante
          Zqcitta12: "", //Citta secondo quietanzante
          Zqcap12: "", //Cap secondo quietanzante
          Zqprovincia12: "", //Provincia secondo quietanzante
          Stras: "", //Via,numero civico
          Ort01: "", //Località
          Regio: "", //Regione
          Pstlz: "", //Codice di avviamento postale
          Land1: "", //Codice paese
          FlagInpsEditabile: false,
        });

        var oModelTipoPersona = new JSONModel({
          PersonaFisica: false,
          PersonaGiuridica: false,
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

        var oModelClassificazione = new JSONModel({
          CodiceGestionale: [],
          Cpv: [],
          Cig: [],
          Cup: [],
          ImpTotAssociareCodiceGestionale: "0.00",
          ImpTotAssociareCpv: "0.00",
          ImpTotAssociareCig: "0.00",
          ImpTotAssociareCup: "0.00",
        });

        var oInputImpDaOrd = self.getView().byId("iptImpDaOrd");
        oInputImpDaOrd.attachBrowserEvent(
          "keypress",
          formatter.acceptOnlyNumbers
        );

        var oInputImpDaAssociare = self.getView().byId("iptImpDaAssociare");
        oInputImpDaAssociare.attachBrowserEvent(
          "keypress",
          formatter.acceptOnlyNumbers
        );

        self.setModel(oModelPaginator, PAGINATOR_MODEL);
        self.setModel(oModelSoa, "Soa");
        self.setModel(oStepScenario, "StepScenario");
        self.setModel(oModelTipoPersona, "TipoPersona");
        self.setModel(oModelClassificazione, "Classificazione");

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
        var oModelSoa = self.getModel("Soa");

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
          oModelSoa.setProperty("/data", []);
        } else if (bWizard1Step3) {
          oStepScenarioModel.setProperty("/wizard1Step3", false);
          oStepScenarioModel.setProperty("/wizard1Step2", true);
          oModelSoa.setProperty("/Zimptot", "0.00");
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
        var oModelSoa = self.getModel("Soa");
        var oBundle = self.getResourceBundle();

        var bWizard1Step2 = oStepScenarioModel.getProperty("/wizard1Step2");
        var bWizard1Step3 = oStepScenarioModel.getProperty("/wizard1Step3");
        var bWizard2 = oStepScenarioModel.getProperty("/wizard2");
        var bWizard3 = oStepScenarioModel.getProperty("/wizard3");

        if (bWizard1Step2) {
          if (
            oModelSoa.getProperty("/data").length === 0 ||
            oModelSoa.getProperty("/Zimptot") === "0.00"
          ) {
            sap.m.MessageBox.error(oBundle.getText("msgNoDocuments"));
          } else {
            oStepScenarioModel.setProperty("/wizard1Step2", false);
            oStepScenarioModel.setProperty("/wizard1Step3", true);
            oModelSoa.setProperty(
              "/Zimptot",
              oModelSoa.getProperty("/Zimptot")
            );
          }
        } else if (bWizard1Step3) {
          oStepScenarioModel.setProperty("/wizard1Step3", false);
          oStepScenarioModel.setProperty("/wizard2", true);
          this._setDataBenficiario();
          this._setModalitaPagamento();
          this._setIbanBeneficiario();
          this._setDatiVaglia();
          this._getSedeBeneficiario();
          this._setInpsData();
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
        var oModelSoa = self.getModel("Soa");
        //Load Component
        var oTableDocumenti = self.getView().byId("tblQuoteDocumenti");
        var oButtonCalculate = self.getView().byId("btnCalculate");

        var aListRiepilogo = oModelSoa.getProperty("/data");
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
        oModelSoa.setProperty("/Zimptot", "0.00");
        oModelSoa.setProperty("/data", aListRiepilogo);
      },

      onCalcute: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var aListRiepilogo = oModelSoa.getProperty("/data");
        var fTotal = 0;

        aListRiepilogo.map((oSelectedItem) => {
          fTotal += parseFloat(oSelectedItem?.ImpDaOrd);
        });

        oModelSoa.setProperty("/Zimptot", fTotal.toFixed(2));
      },

      //#region VALUE HELP

      onValueHelpRitenuta: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.openDialog(
          "rgssoa.view.fragment.valueHelp.searchDocumenti." + sFragmentName
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
          "rgssoa.view.fragment.valueHelp.searchDocumenti." + sFragmentName
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
          "rgssoa.view.fragment.valueHelp.searchDocumenti." + sFragmentName
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
          "rgssoa.view.fragment.valueHelp.searchDocumenti." + sFragmentName
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
          "rgssoa.view.fragment.valueHelp.searchDocumenti." + sFragmentName
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
          "rgssoa.view.fragment.valueHelp.searchDocumenti." + sFragmentName
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
          "rgssoa.view.fragment.valueHelp.searchDocumenti." + sFragmentName
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
          "rgssoa.view.fragment.valueHelp.searchDocumenti." + sFragmentName
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
          "rgssoa.view.fragment.valueHelp.searchDocumenti." + sFragmentName
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
          "rgssoa.view.fragment.valueHelp.searchDocumenti." + sFragmentName
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
        var self = this;
        var oInput = self.getView().byId("fltTipoBeneficiario");
        var oModelSoa = self.getModel("Soa");

        this._setEditableRitenuta(oEvent.getParameter("value"));
        oModelSoa.setProperty("/BuType", oInput.getSelectedKey());
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
        var oModelSoa = self.getModel("Soa");

        var sValue = oEvent.getParameter("value");
        oModelSoa.setProperty("/Zimptot", "0.00");

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
        var oModelSoa = self.getModel("Soa");

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
            oModelSoa?.getProperty("/Fipos")
          )
        );
        aFilters.push(
          new Filter(
            "Fistl",
            FilterOperator.EQ,
            oModelSoa?.getProperty("/Fistl")
          )
        );

        return aFilters;
      },

      _onObjectMatched: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
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
                oModelSoa.setProperty("/Gjahr", data?.Gjahr);
                oModelSoa.setProperty("/Zzamministr", data?.Zzamministr);
                oModelSoa.setProperty("/ZufficioCont", data?.ZufficioCont);
                oModelSoa.setProperty("/Fipos", data?.Fipos);
                oModelSoa.setProperty("/Fistl", data?.Fistl);
                oModelSoa.setProperty("/Zchiaveaut", data?.Zchiaveaut);
                oModelSoa.setProperty("/Ztipodisp2", data?.Ztipodisp2);
                oModelSoa.setProperty("/Zdesctipodisp2", data?.Zdesctipodisp2);
                oModelSoa.setProperty("/Ztipodisp3", data?.Ztipodisp3);
                oModelSoa.setProperty("/Zdesctipodisp3", data?.Zdesctipodisp3);
                oModelSoa.setProperty("/Zdesctipodisp3", data?.Zdesctipodisp3);
                oModelSoa.setProperty("/Zimpaut", data?.Zimpaut);
                oModelSoa.setProperty("/Zimpdispaut", data?.Zimpdispaut);
                oModelSoa.setProperty("/Zfunzdel", data?.Zfunzdel);
                oModelSoa.setProperty("/Zdescriz", data?.Zdescriz);
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
        var oModelSoa = self.getModel("Soa");
        //Load Component
        var oPanelPaginator = oView.byId("pnlPaginator");
        var oTableDocumenti = oView.byId("tblQuoteDocumenti");
        var oPanelCalculator = oView.byId("pnlCalculatorList");

        var aListRiepilogo = oModelSoa.getProperty("/data");
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

      //#region VALUE HELP

      onValueHelpModPagamento: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.openDialog(
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

        this._setDatiVaglia();
        this._setInpsData();

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

      onValueHelpCausaleValutaria: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();

        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.openDialog(
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
          this.closeDialog();
          return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        oInput.data("key", sKey);
        this.closeDialog();
      },

      onValueHelpCoordEstere: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.openDialog(
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
          this.closeDialog();
          return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        oInput.data("swift", sSwift);
        this.closeDialog();
      },

      onValueHelpIban: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.openDialog(
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

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "IbanBeneficiarioSOASet", {
              filters: aFilters,
              success: function (data, oResponse) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "IbanBeneficiario");
                oDialog.open();
              },
              error: function (error) {},
            });
          });
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
          this.closeDialog();
          return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        this.closeDialog();
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
          this.closeDialog();
          return;
        }

        if (oModelSoa.getProperty("/Zwels") === "ID1") {
          oModelSoa.setProperty("/Zstcd1", oSelectedItem?.getTitle());
        } else if (oModelSoa.getProperty("/Zwels") === "ID2") {
          oModelSoa.setProperty("/Zstcd3", oSelectedItem?.getTitle());
        }

        oInput.setValue(oSelectedItem.getTitle());
        this.closeDialog();
      },

      onValueHelpCodiceFiscale1: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.openDialog(
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
        console.log(oSelectedItem);
        var sInput = oSource.data().input;
        var oInput = self.getView().byId(sInput);

        this._resetCodiceFiscale2();

        if (!oSelectedItem) {
          oInput.resetProperty("value");
          this.closeDialog();
          return;
        }

        oModelSoa.setProperty("/Zstcd12", oSelectedItem?.getTitle());

        oInput.setValue(oSelectedItem.getTitle());
        this.closeDialog();
      },

      onValueHelpCodiceFiscale2: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.openDialog(
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
        var oDialog = self.openDialog(
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

        this.closeDialog();
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
        oModelSoa.setProperty("/Pstlz", oInputData?.Pstlz);
        oModelSoa.setProperty("/Land1", oInputData?.Land1);
      },

      onInpsChange: function (oEvent) {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        oModelSoa.setProperty(
          "/" + oEvent.getSource().data().field,
          oEvent.getParameter("value")
        );

        console.log(oModelSoa.getData());
      },

      //#endregion

      //#region PRIVATE METHODS
      _setDataBenficiario: function () {
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

      _setModalitaPagamento: function () {
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

      _setIbanBeneficiario: function () {
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

      _setDatiVaglia: function () {
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

      _getSedeBeneficiario: function () {
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

      _setInpsData: function () {
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
        var oDialog = self.openDialog(
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
          this.closeDialog();
          return;
        }

        aListClassificazione[sIndex].Zcos = oSelectedItem.getTitle();
        aListClassificazione[sIndex].ZcosDesc = oSelectedItem.getDescription();
        oModelClassificazione.setProperty(
          "/CodiceGestionale",
          aListClassificazione
        );

        this.closeDialog();
      },
      //#endregion

      //#region SELECTION CHANGE
      onCodiceGestionaleChange: function (oEvent) {
        console.log("parameters", oEvent.getParameters());
        console.log("source", oEvent.getSource());
      },

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

      //#endregion
    });
  }
);
