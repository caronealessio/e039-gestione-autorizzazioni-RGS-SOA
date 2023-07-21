sap.ui.define(
  [
    "./BaseScenarioController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (
    BaseScenarioController,
    JSONModel,
    formatter,
    Filter,
    FilterOperator
  ) {
    "use strict";

    var bPrevalLoaded = false;
    const PAGINATOR_MODEL = "paginatorModel";
    return BaseScenarioController.extend("rgssoa.controller.Scenario2", {
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
          Ztipopag: "2", //Tipo Pagamento

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

        var oModelTipoPersona = new JSONModel({
          PersonaFisica: false,
          PersonaGiuridica: false,
        });

        var oModelNewModalitaPagamento = new JSONModel({
          SZwels: "",
          Zdescwels: "",
          SType: "",
          SCountryRes: "",
          SIban: "",
          Ztipofirma: "",
          DescZtipofirma: "",
          Swift: "",
          Zcoordest: "",
          ValidFromDats: "",
          ValidToDats: "",
          Gjahr: "",
          Zcapo: "",
          Zcapitolo: "",
          Zarticolo: "",
          Zconto: "",
          ZdescConto: "",
          DescPaeseResidenza: "",
          VisibleNewModalitaPagamento: true,
          VisibleNewQuietanzante: false,
          VisibleNewDestinatario: false,
          titleDialog: "Inserisci Modalità di Pagamento",
          Quietanzante: {
            Zqnome: "",
            Zqcognome: "",
            Zqqualifica: "",
            Stcd1: "",
            Zqdatanasc: "",
            Zqluogonasc: "",
            Zqprovnasc: "",
            Zqindiriz: "",
            Zqcitta: "",
            Zqcap: "",
            Zqprovincia: "",
            Zqtelefono: "",
          },
          Destinatario: {
            Zqnomedest: "",
            Zqcognomedest: "",
            Zqqualificadest: "",
            Stcd1Dest: "",
            Zqdatanascdest: "",
            Zqluogonascdest: "",
            Zqprovnascdest: "",
            Zqindirizdest: "",
            Zqcittadest: "",
            Zqcapdest: "",
            Zqprovinciadest: "",
            Zqtelefonodest: "",
          },
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

        self.setModel(oModelSoa, "Soa");
        self.setModel(oModelPaginator, PAGINATOR_MODEL);
        self.setModel(oStepScenario, "StepScenario");
        self.setModel(oModelTipoPersona, "TipoPersona");
        self.setModel(oModelNewModalitaPagamento, "NewModalitaPagamento");
        self.setModel(oModelClassificazione, "Classificazione");

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
        var oInputImpDaAssociareCpv = self
          .getView()
          .byId("iptImpDaAssociareCpv");
        oInputImpDaAssociareCpv.attachBrowserEvent(
          "keypress",
          formatter.acceptOnlyNumbers
        );

        //TODO - Inserire l'acceptOnlyNumber anche per CIG e CUP
        this.getRouter()
          .getRoute("soa.create.scenario.Scenario2")
          .attachPatternMatched(this._onObjectMatched, this);
      },

      onBeforeRendering: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oInputUffContabile = self.getView().byId("fltUfficioContabile");
        var oInputUffPagatore = self.getView().byId("fltUfficioPagatore");

        if (!bPrevalLoaded) {
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + "PrevalUfficioContabileSet", {
                success: function (data) {
                  oInputUffContabile.setValue(data?.results[0]?.Fkber);
                  oInputUffPagatore.setValue(data?.results[0]?.Fkber);
                  bPrevalLoaded = true;
                },
                error: function (error) {},
              });
            });
        }
      },

      onNavBack: function () {
        var self = this;
        var oView = self.getView();
        var oWizard = oView.byId("wizScenario2");
        //Load Models
        var oModelStepScenario = self.getModel("StepScenario");
        var oModelSoa = self.getModel("Soa");

        var bWizard1Step1 = oModelStepScenario.getProperty("/wizard1Step1");
        var bWizard1Step2 = oModelStepScenario.getProperty("/wizard1Step2");
        var bWizard1Step3 = oModelStepScenario.getProperty("/wizard1Step3");
        var bWizard2 = oModelStepScenario.getProperty("/wizard2");
        var bWizard3 = oModelStepScenario.getProperty("/wizard3");
        var bWizard4 = oModelStepScenario.getProperty("/wizard4");

        if (bWizard1Step1) {
          history.go(-1);
        } else if (bWizard1Step2) {
          oModelStepScenario.setProperty("/wizard1Step2", false);
          oModelStepScenario.setProperty("/wizard1Step1", true);
          oModelStepScenario.setProperty("/visibleBtnForward", false);
          oModelStepScenario.setProperty("/visibleBtnStart", true);
          oModelSoa.setProperty("/data", []);
          oModelSoa.setProperty("/Zimptot", "0.00");
        } else if (bWizard1Step3) {
          oModelStepScenario.setProperty("/wizard1Step3", false);
          oModelStepScenario.setProperty("/wizard1Step2", true);
        } else if (bWizard2) {
          oModelStepScenario.setProperty("/wizard2", false);
          oModelStepScenario.setProperty("/wizard1Step3", true);
          oWizard.previousStep();
        } else if (bWizard3) {
          oModelStepScenario.setProperty("/wizard3", false);
          oModelStepScenario.setProperty("/wizard2", true);
          oWizard.previousStep();
        } else if (bWizard4) {
          oModelStepScenario.setProperty("/wizard4", false);
          oModelStepScenario.setProperty("/wizard3", true);
          oModelStepScenario.setProperty("/visibleBtnForward", true);
          oModelStepScenario.setProperty("/visibleBtnSave", false);
          oWizard.previousStep();
        }
      },

      onNavForward: function () {
        var self = this;
        var oWizard = self.getView().byId("wizScenario2");
        var oModelStepScenario = self.getModel("StepScenario");

        var bWizard1Step2 = oModelStepScenario.getProperty("/wizard1Step2");
        var bWizard1Step3 = oModelStepScenario.getProperty("/wizard1Step3");
        var bWizard2 = oModelStepScenario.getProperty("/wizard2");
        var bWizard3 = oModelStepScenario.getProperty("/wizard3");

        if (bWizard1Step2) {
          //TODO - Riaggiungere

          // if (this._checkQuoteDocumenti()) {
          //   oModelStepScenario.setProperty("/wizard1Step2", false);
          //   oModelStepScenario.setProperty("/wizard1Step3", true);
          // }
          oModelStepScenario.setProperty("/wizard1Step2", false);
          oModelStepScenario.setProperty("/wizard1Step3", true);
        } else if (bWizard1Step3) {
          oModelStepScenario.setProperty("/wizard1Step3", false);
          oModelStepScenario.setProperty("/wizard2", true);
          self.setDataBenficiario();
          self.setModalitaPagamento();
          self.setIbanBeneficiario();
          self.setDatiVaglia();
          self.getSedeBeneficiario();
          self.setInpsData();
          oWizard.nextStep();
        } else if (bWizard2) {
          oModelStepScenario.setProperty("/wizard2", false);
          oModelStepScenario.setProperty("/wizard3", true);
          oWizard.nextStep();
        } else if (bWizard3) {
          // TODO - Decommentare
          // if (this._checkClassificazione()) {
          oModelStepScenario.setProperty("/wizard3", false);
          oModelStepScenario.setProperty("/wizard4", true);
          oModelStepScenario.setProperty("/visibleBtnForward", false);
          oModelStepScenario.setProperty("/visibleBtnSave", true);
          this.setCausalePagamento();
          oWizard.nextStep();
          // }
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
        var oModelDocumenti = self.getModel("QuoteDocumentiScen2");
        var oModelSoa = self.getModel("Soa");
        //Load Component
        var oTableDocumenti = self.getView().byId("tblQuoteDocumentiScen2");
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
              if (oRecord.Docid === oItem.Docid) {
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
              return !(oSelectedItem.Docid === oItem.Docid);
            });
          });
        }

        oButtonCalculate.setVisible(aListRiepilogo.length !== 0);
        oModelSoa.setProperty("/Zimptot", "0.00");
        oModelSoa.setProperty("/data", aListRiepilogo);
      },

      onCalculate: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var aListRiepilogo = oModelSoa.getProperty("/data");
        var fTotal = 0;

        aListRiepilogo.map((oSelectedItem) => {
          fTotal += parseFloat(oSelectedItem?.Zimpdaord);
        });

        oModelSoa.setProperty("/Zimptot", fTotal.toFixed(2));
      },

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

      //#region SELECTION CHANGE

      onImpDaOrdinareChange: function (oEvent) {
        var self = this;
        //Load Component
        var oTableDocumenti = self.getView().byId("tblQuoteDocumentiScen2");
        //Load Models
        var oTableModelDocumenti = oTableDocumenti.getModel(
          "QuoteDocumentiScen2"
        );
        var oModelSoa = self.getModel("Soa");

        var sValue = oEvent.getParameter("value");
        oModelSoa.setProperty("/Zimptot", "0.00");

        oTableModelDocumenti.getObject(
          oEvent.getSource().getParent().getBindingContextPath()
        ).Zimpdaord = parseFloat(sValue).toFixed(2);
      },

      //#endregion

      //#region PRIVATE METHODS

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

      _getQuoteDocumentiFilters: function () {
        var self = this;
        var aFilters = [];
        var oView = self.getView();
        var oModelSoa = self.getModel("Soa");

        var oQuoteEsigibili = oView.byId("fltQuoteEsigibili");
        var oDataEsigibilitaFrom = oView.byId("fltDataEsigibilitaFrom");
        var oDataEsigibilitaTo = oView.byId("fltDataEsigibilitaTo");
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

        self.setFilterEQ(aFilters, "Fipex", oModelSoa?.getProperty("/Fipos"));
        self.setFilterEQ(aFilters, "Fistl", oModelSoa?.getProperty("/Fistl"));
        self.setFilterEQ(
          aFilters,
          "UfficioPagatore",
          oUfficioPagatore.getValue()
        );
        self.setFilterEQ(
          aFilters,
          "UfficioContabile",
          oUfficioContabile.getValue()
        );
        self.setFilterMultiInputEQText(
          aFilters,
          "NumDocBen",
          oNDocBeneficiario
        );
        self.setFilterEQ(aFilters, "Cup", oCUP.getValue());
        self.setFilterEQ(aFilters, "Cig", oCIG.getValue());
        self.setFilterEQ(aFilters, "Gjahr", oModelSoa?.getProperty("/Gjahr"));
        self.setFilterEQ(
          aFilters,
          "CodRitenuta",
          oModelSoa?.getProperty("/Witht")
        );
        self.setFilterEQ(
          aFilters,
          "CodEnte",
          oModelSoa?.getProperty("/ZzCebenra")
        );
        self.setFilterEQ(aFilters, "Lifnr", oModelSoa?.getProperty("/Lifnr"));
        self.setFilterMultiComboBoxEQKey(
          aFilters,
          "AnnoRegDocumento",
          oAnnoRegDocumento
        );
        self.setFilterMultiComboBoxEQKey(
          aFilters,
          "AnnoDocBeneficiario",
          oAnnoDocBeneficiario
        );
        self.setFilterBT(
          aFilters,
          "DateEsigibilita",
          oDataEsigibilitaFrom.getValue(),
          oDataEsigibilitaTo.getValue()
        );
        self.setFilterBT(
          aFilters,
          "Belnr",
          oNRegDocumentoFrom.getValue(),
          oNRegDocumentoTo.getValue()
        );
        self.setFilterEQ(aFilters, "AreaFunz", oUfficioContabile.data("key"));
        self.setFilterBT(
          aFilters,
          "ScadenzaDoc",
          oScadenzaDocFrom.getValue(),
          oScadenzaDocTo.getValue()
        );
        if (oQuoteEsigibili.getSelected()) {
          aFilters.push(new Filter("Zquoteesi", FilterOperator.EQ, true));
        }

        return aFilters;
      },

      _setPaginatorProperties: function () {
        var self = this;
        var oDataModel = self.getModel();
        var aFilters = this._getQuoteDocumentiFilters();

        //Check BEETWEN filters
        if (self.checkBTFilter(aFilters)) {
          return;
        }

        var oPaginatorModel = self.getModel(PAGINATOR_MODEL);
        self.resetPaginator(oPaginatorModel);
        var iNumRecordsForPage =
          oPaginatorModel.getProperty("/numRecordsForPage");

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "QuoteDocumentiScen2Set" + "/$count", {
              filters: aFilters,
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
        var oModelStepScenario = self.getModel("StepScenario");
        var oPaginatorModel = self.getModel(PAGINATOR_MODEL);
        var oModelSoa = self.getModel("Soa");
        //Load Component
        var oPanelPaginator = oView.byId("pnlPaginator");
        var oTableDocumenti = oView.byId("tblQuoteDocumentiScen2");
        var oPanelCalculator = oView.byId("pnlCalculatorList");

        var aListRiepilogo = oModelSoa.getProperty("/data");
        var aFilters = this._getQuoteDocumentiFilters();
        var urlParameters = {
          $top: oPaginatorModel.getProperty("/numRecordsForPage"),
          $skip: oPaginatorModel.getProperty("/paginatorSkip"),
        };

        //Check BEETWEN filters
        var sIntervalFilter = self.checkBTFilter(aFilters);
        if (sIntervalFilter) {
          sap.m.MessageBox.error(sIntervalFilter);
          self.clearModel("QuoteDocumentiScen2");
          return;
        }

        oView.setBusy(true);

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "QuoteDocumentiScen2Set", {
              urlParameters: urlParameters,
              filters: aFilters,
              success: function (data, oResponse) {
                if (!self.setResponseMessage(oResponse)) {
                  oModelStepScenario.setProperty("/wizard1Step1", false);
                  oModelStepScenario.setProperty("/wizard1Step2", true);
                  oModelStepScenario.setProperty("/visibleBtnForward", true);
                  oModelStepScenario.setProperty("/visibleBtnStart", false);
                }
                self.setModelCustom("QuoteDocumentiScen2", data.results);

                oPanelPaginator.setVisible(data.results.length !== 0);
                oPanelCalculator.setVisible(data.results.length !== 0);

                if (data.results !== 0) {
                  data.results.map((oItem, iIndex) => {
                    //Vengono selezionati i record quando viene caricata l'entità
                    aListRiepilogo.map((oSelectedItem) => {
                      if (oItem.Docid === oSelectedItem.Docid) {
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

      _checkQuoteDocumenti: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oBundle = self.getResourceBundle();

        var fImpTot = parseFloat(oModelSoa.getProperty("/Zimptot"));
        var fImpDispAutorizzazione = parseFloat(
          oModelSoa.getProperty("/Zimpdispaut")
        );

        if (fImpTot > fImpDispAutorizzazione) {
          sap.m.MessageBox.error(oBundle.getText("msgImpTotGreaterImpDispAut"));
          return false;
        }

        if (
          oModelSoa.getProperty("/data").length === 0 ||
          oModelSoa.getProperty("/Zimptot") === "0.00"
        ) {
          sap.m.MessageBox.error(oBundle.getText("msgNoDocuments"));
          return false;
        }

        return true;
      },

      //#endregion

      //#endregion
    });
  }
);