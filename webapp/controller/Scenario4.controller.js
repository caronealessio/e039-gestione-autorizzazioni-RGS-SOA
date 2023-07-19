sap.ui.define(
  ["./BaseController", "../model/formatter", "sap/ui/model/json/JSONModel"],
  function (BaseController, formatter, JSONModel) {
    "use strict";

    return BaseController.extend("rgssoa.controller.Scenario4", {
      formatter: formatter,
      onInit: function () {
        var self = this;
        var oModelSoa = new JSONModel({
          /**   Scenario    */
          Ztipopag: "4", //Tipo Pagamento

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

        self.setModel(oModelSoa, "Soa");

        this.getRouter()
          .getRoute("soa.create.scenario.Scenario4")
          .attachPatternMatched(this._onObjectMatched, this);
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
      //#endregion
    });
  }
);
