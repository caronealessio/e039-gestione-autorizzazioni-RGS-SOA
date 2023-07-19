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

    return BaseController.extend("rgssoa.controller.Scenario3", {
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
          visibleBtnSave: false,
        });

        var oModelSoa = new JSONModel({
          /**   Scenario    */
          Ztipopag: "3", //Tipo Pagamento

          /**   Dati SOA (Parte celeste in alto)   */
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

          data: [], //Quote Documenti

          /**   WIZARD 2 - Beneficiario SOA   */
          Zidsede: "", //Sede
          BuType: "", //Tipologia Persona
          Taxnumxl: "", //Codice Fiscale Estero
          Zdenominazione: "", //Descrizione Sede
          Zdurc: "", //Numero identificativo Durc
          ZfermAmm: "", //Fermo amministrativo

          /**   WIZARD 2 - Modalità Pagamento   */
          Zwels: "", //Codice Modalità Pagamento
          ZCausaleval: "", //Causale Valutaria
          Swift: "", //BIC
          Zcoordest: "", //Cordinate Estere
          Iban: "", //IBAN
          Zmotivaz: "", //Motivazione cambio IBAN
          Zdescwels: "", //Descrizione Modalità Pagamento
          Zbanks: "", //Paese di Residenza (Primi 2 digit IBAN)
          ZDesccauval: "", //Descrizione Causale Valutaria

          /**   WIZARD 2 - Dati Quietanzante/Destinatario Vaglia    */
          Ztipofirma: "", //Tipologia Firma
          ZpersCognomeQuiet1: "", //Cognome primo quietanzante
          ZpersCognomeQuiet2: "", //Cognome secondo quietanzante
          ZpersNomeQuiet1: "", //Nome primo quietanzante
          ZpersNomeQuiet2: "", //Nome secondo quietanzante
          ZpersNomeVaglia: "", //Nome persona vagliaesigibilità
          ZpersCognomeVaglia: "", //Cognome persona vaglia
          Zstcd1: "", //Codice Fiscale Utilizzatore
          Zstcd12: "", //Codice fiscale secondo quietanzante
          Zstcd13: "", //Codice fiscale destinatario vaglia
          Zqindiriz: "", //Indirizzo primo quietanzante
          Zqcitta: "", //Citta primo quietanzantez
          Zqcap: "", //Cap primo quietanzante
          Zqprovincia: "", //Provincia primo quietanzante
          Zqindiriz12: "", //Indirizzo secondo quietanzante
          Zqcitta12: "", //Citta secondo quietanzante
          Zqcap12: "", //Cap secondo quietanzante
          Zqprovincia12: "", //Provincia secondo quietanzante

          /**   WIZARD 2 - INPS    */
          Zcodprov: "", //INPS - Codice Provenienza
          Zcfcommit: "", //INPS - Codice Fiscale Committente
          Zcodtrib: "", //INPS - Codice tributo
          Zperiodrifda: "", //INPS - Periodo riferimento da
          Zperiodrifa: "", //INPS - Periodo riferimento a
          Zcodinps: "", //INPS - Matricola INPS/Codice INPS/Filiale azienda
          Zcfvers: "", //INPS - Codice Fiscale Versante
          Zcodvers: "", //INPS - Codice Versante
          FlagInpsEditabile: false,

          /**   WIZARD 2 - Sede Beneficiario */
          Stras: "", //Via,numero civico
          Ort01: "", //Località
          Regio: "", //Regione
          Pstlz: "", //Codice di avviamento postale
          Land1: "", //Codice paese

          /**   WIZARD 3    */
          Classificazione: [], //Classificazioni

          /**   WIZARD 4    */
          Zcausale: "", //Causale di pagamento
          ZE2e: "", //E2E ID
          Zlocpag: "", //Località pagamento
          Zzonaint: "", //Zona di intervento
          Znumprot: "", //Numero protocollo
          Zdataprot: "", //Data protocollo
          Zdataesig: "", //TODO - Punto Aperto - Data esigibilità
        });

        // var oModelPaginator = new JSONModel({
        //   btnPrevEnabled: false,
        //   btnFirstEnabled: false,
        //   btnNextEnabled: false,
        //   btnLastEnabled: false,
        //   recordForPageEnabled: false,
        //   currentPageEnabled: true,
        //   numRecordsForPage: 10,
        //   currentPage: 1,
        //   maxPage: 1,
        //   paginatorSkip: 0,
        //   paginatorClick: 0,
        //   paginatorTotalPage: 1,
        // });

        // var oModelTipoPersona = new JSONModel({
        //   PersonaFisica: false,
        //   PersonaGiuridica: false,
        // });

        // var oModelNewModalitaPagamento = new JSONModel({
        //   SZwels: "",
        //   Zdescwels: "",
        //   SType: "",
        //   SCountryRes: "",
        //   SIban: "",
        //   Ztipofirma: "",
        //   DescZtipofirma: "",
        //   Swift: "",
        //   Zcoordest: "",
        //   ValidFromDats: "",
        //   ValidToDats: "",
        //   Gjahr: "",
        //   Zcapo: "",
        //   Zcapitolo: "",
        //   Zarticolo: "",
        //   Zconto: "",
        //   ZdescConto: "",
        //   DescPaeseResidenza: "",
        //   VisibleNewModalitaPagamento: true,
        //   VisibleNewQuietanzante: false,
        //   VisibleNewDestinatario: false,
        //   titleDialog: "Inserisci Modalità di Pagamento",
        //   Quietanzante: {
        //     Zqnome: "",
        //     Zqcognome: "",
        //     Zqqualifica: "",
        //     Stcd1: "",
        //     Zqdatanasc: "",
        //     Zqluogonasc: "",
        //     Zqprovnasc: "",
        //     Zqindiriz: "",
        //     Zqcitta: "",
        //     Zqcap: "",
        //     Zqprovincia: "",
        //     Zqtelefono: "",
        //   },
        //   Destinatario: {
        //     Zqnomedest: "",
        //     Zqcognomedest: "",
        //     Zqqualificadest: "",
        //     Stcd1Dest: "",
        //     Zqdatanascdest: "",
        //     Zqluogonascdest: "",
        //     Zqprovnascdest: "",
        //     Zqindirizdest: "",
        //     Zqcittadest: "",
        //     Zqcapdest: "",
        //     Zqprovinciadest: "",
        //     Zqtelefonodest: "",
        //   },
        // });

        // var oModelClassificazione = new JSONModel({
        //   CodiceGestionale: [],
        //   Cpv: [],
        //   Cig: [],
        //   Cup: [],
        //   ImpTotAssociareCodiceGestionale: "0.00",
        //   ImpTotAssociareCpv: "0.00",
        //   ImpTotAssociareCig: "0.00",
        //   ImpTotAssociareCup: "0.00",
        // });

        self.setModel(oModelSoa, "Soa");
        // self.setModel(oModelPaginator, PAGINATOR_MODEL);
        self.setModel(oStepScenario, "StepScenario");
        // self.setModel(oModelTipoPersona, "TipoPersona");
        // self.setModel(oModelNewModalitaPagamento, "NewModalitaPagamento");
        // self.setModel(oModelClassificazione, "Classificazione");

        // var oInputImpDaOrd = self.getView().byId("iptImpDaOrd");
        // oInputImpDaOrd.attachBrowserEvent(
        //   "keypress",
        //   formatter.acceptOnlyNumbers
        // );
        // var oInputImpDaAssociare = self.getView().byId("iptImpDaAssociare");
        // oInputImpDaAssociare.attachBrowserEvent(
        //   "keypress",
        //   formatter.acceptOnlyNumbers
        // );
        // var oInputImpDaAssociareCpv = self.getView().byId("iptImpDaAssociareCpv");
        // oInputImpDaAssociareCpv.attachBrowserEvent(
        //   "keypress",
        //   formatter.acceptOnlyNumbers
        // );

        //TODO - Inserire l'acceptOnlyNumber anche per CIG e CUP
        this.getRouter()
          .getRoute("soa.create.scenario.Scenario3")
          .attachPatternMatched(this._onObjectMatched, this);
      },

      onNavBack: function () {
        var self = this;
        var oView = self.getView();
        var oWizard = oView.byId("wizScenario3");
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
          oStepScenarioModel.setProperty("/visibleBtnForward", true);
          oStepScenarioModel.setProperty("/visibleBtnSave", false);
          oWizard.previousStep();
        }
      },

      onNavForward: function () {
        var self = this;
        var oWizard = self.getView().byId("wizScenario3");
        var oStepScenarioModel = self.getModel("StepScenario");

        var bWizard1Step2 = oStepScenarioModel.getProperty("/wizard1Step2");
        var bWizard1Step3 = oStepScenarioModel.getProperty("/wizard1Step3");
        var bWizard2 = oStepScenarioModel.getProperty("/wizard2");
        var bWizard3 = oStepScenarioModel.getProperty("/wizard3");

        if (bWizard1Step2) {
          //TODO - Rimettere
          // if (this._checkQuoteDocumenti()) {
          //   oStepScenarioModel.setProperty("/wizard1Step2", false);
          //   oStepScenarioModel.setProperty("/wizard1Step3", true);
          // }
          oStepScenarioModel.setProperty("/wizard1Step2", false);
          oStepScenarioModel.setProperty("/wizard1Step3", true);
        } else if (bWizard1Step3) {
          oStepScenarioModel.setProperty("/wizard1Step3", false);
          oStepScenarioModel.setProperty("/wizard2", true);
          // this._setDataBenficiario();
          // this._setModalitaPagamento();
          // this._setIbanBeneficiario();
          // this._setDatiVaglia();
          // this._getSedeBeneficiario();
          // this._setInpsData();
          oWizard.nextStep();
        } else if (bWizard2) {
          oStepScenarioModel.setProperty("/wizard2", false);
          oStepScenarioModel.setProperty("/wizard3", true);
          oWizard.nextStep();
        } else if (bWizard3) {
          // TODO - Decommentare
          // if (this._checkClassificazione()) {
          oStepScenarioModel.setProperty("/wizard3", false);
          oStepScenarioModel.setProperty("/wizard4", true);
          oStepScenarioModel.setProperty("/visibleBtnForward", false);
          oStepScenarioModel.setProperty("/visibleBtnSave", true);
          // this._setCausalePagamento();
          oWizard.nextStep();
          // }
        }
      },

      //#region WIZARD 1
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

      //#region VALUE HELP
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

      //#region PRIVATE METHODS
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
      //#endregion

      //#endregion
    });
  }
);
