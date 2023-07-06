sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
  ],
  function (
    Controller,
    UIComponent,
    mobileLibrary,
    Filter,
    FilterOperator,
    JSONModel
  ) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;
    var sDialog;

    const EQ = FilterOperator.EQ;
    const BT = FilterOperator.BT;
    const CONTAINS = FilterOperator.Contains;

    return Controller.extend("rgssoa.controller.BaseController", {
      /**
       * Convenience method for accessing the router.
       * @public
       * @returns {sap.ui.core.routing.Router} the router for this component
       */
      getRouter: function () {
        return UIComponent.getRouterFor(this);
      },

      /**
       * Convenience method for getting the view model by name.
       * @public
       * @param {string} [sName] the model name
       * @returns {sap.ui.model.Model} the model instance
       */
      getModel: function (sName) {
        return this.getView().getModel(sName);
      },

      /**
       * Convenience method for setting the view model.
       * @public
       * @param {sap.ui.model.Model} oModel the model instance
       * @param {string} sName the model name
       * @returns {sap.ui.mvc.View} the view instance
       */
      setModel: function (oModel, sName) {
        return this.getView().setModel(oModel, sName);
      },

      /**
       * Getter for the resource bundle.
       * @public
       * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
       */
      getResourceBundle: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      },

      _getIdElement: function (oEvent) {
        var longId = oEvent.getSource().getId();
        var arrayId = longId.split("-");
        var id = arrayId[arrayId.length - 1];
        return id;
      },

      _stringtoTimestamp: function (dateString, formatDelimiter) {
        var dateTimeParts = dateString.split(formatDelimiter);
        var date = new Date(
          dateTimeParts[2],
          parseInt(dateTimeParts[1], 10) - 1,
          dateTimeParts[0]
        );
        return date;
      },

      getTotalCounter: function (sapMessage) {
        var self = this;
        var counter = JSON.parse(sapMessage);
        return counter.message;
        // listAuthModel.setProperty("/total", counter.message);
        // self.counterRecords(counter.message);
      },

      /**
       * Event handler when the share by E-Mail button has been clicked
       * @public
       */
      onShareEmailPress: function () {
        var oViewModel =
          this.getModel("objectView") || this.getModel("worklistView");
        URLHelper.triggerEmail(
          null,
          oViewModel.getProperty("/shareSendEmailSubject"),
          oViewModel.getProperty("/shareSendEmailMessage")
        );
      },

      setResponseMessage: function (oResponse) {
        var bError = false;
        if (oResponse?.headers["sap-message"]) {
          var oMessage = JSON.parse(oResponse.headers["sap-message"]);

          switch (oMessage.severity) {
            case "error":
              sap.m.MessageBox.error(oMessage.message);
              bError = true;
              break;
            case "success":
              sap.m.MessageBox.success(oMessage.message);
              break;
            case "warning":
              sap.m.MessageBox.warning(oMessage.message);
              break;
          }
        }
        return bError;
      },

      setTitleTotalItems: function (
        modelName,
        totalItemsProperties,
        tableTitle,
        tableTitleCount
      ) {
        var sTitle;
        var oModel = this.getModel(modelName);

        var iTotalItems = oModel.getProperty("/" + totalItemsProperties);

        if (iTotalItems > 0) {
          sTitle = this.getResourceBundle().getText(tableTitleCount, [
            iTotalItems,
          ]);
        } else {
          sTitle = this.getResourceBundle().getText(tableTitle);
        }
        oModel.setProperty("/" + tableTitle, sTitle);
      },

      clearModel: function (sNameModel) {
        var oModelJSON = new JSONModel({});
        this.getView().setModel(oModelJSON, sNameModel);
      },

      setModelCustom: function (sNameModel, oData) {
        var oView = this.getView();
        var oModelJson = new JSONModel();
        oModelJson.setData(oData);
        oView.setModel(oModelJson, sNameModel);
      },

      /** -------------------GESTIONE VALUE HELP--------------------------- */

      _createFilterValueHelp: function (key, operator, value, useToLower) {
        return new Filter(
          useToLower ? "tolower(" + key + ")" : key,
          operator,
          useToLower ? "'" + value.toLowerCase() + "'" : value
        );
      },

      onValueHelpChange: function (oEvent) {
        var sValue = oEvent.getParameter("value");
        var oSource = oEvent.getSource();
        var searchPropertyModel = oSource.data()?.searchPropertyModel;
        var oFilter = [];
        var qFilters = [];

        if (searchPropertyModel) {
          oFilter.push(
            this._createFilterValueHelp(
              searchPropertyModel,
              CONTAINS,
              sValue,
              false
            )
          );
          qFilters = new Filter({ filters: oFilter, and: false });
          oSource.getBinding("items").filter(qFilters);
        }
      },

      onValueHelpDialogClose: function (oEvent) {
        var self = this;
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sInput = oSource.data().input;
        var oInput = self.getView().byId(sInput);
        var sKey = oSelectedItem?.data("key");

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

      onValueHelpMultiDialogClose: function (oEvent) {
        var self = this;
        var oContexts = oEvent.getParameter("selectedContexts");
        var oSource = oEvent.getSource().data();
        var sValue = oSource.searchPropertyModel;
        var oMultiInput = self.getView().byId(oSource.input);

        oMultiInput.removeAllTokens();

        if (oContexts?.length) {
          var aData = oContexts.map((oContext) => {
            return oContext.getObject()[sValue];
          });

          for (var i = 0; i < aData.length; i++) {
            oMultiInput.addToken(
              new sap.m.Token({
                text: aData[i],
              })
            );
          }
        }
        this.closeDialog();
      },

      openDialog: function (dialogPath) {
        if (!sDialog) {
          sDialog = sap.ui.xmlfragment(dialogPath, this);
          this.getView().addDependent(sDialog);
        }
        return sDialog;
      },

      closeDialog: function () {
        if (sDialog) {
          if (sDialog.close) {
            sDialog.close();
          }
          sDialog.destroy();
          sDialog = null;
        }
      },

      /** -------------------GESTIONE FILTRI--------------------- */

      setFilterBTValue: function (aFilters, oInputFrom, oInputTo) {
        var sInputFrom = oInputFrom?.getValue() ? oInputFrom?.getValue() : null;
        var sInputTo = oInputTo?.getValue() ? oInputTo?.getValue() : null;

        if (sInputFrom || sInputTo) {
          aFilters.push(
            new Filter(
              oInputFrom?.data("searchPropertyModel"),
              BT,
              sInputFrom,
              sInputTo
            )
          );
        }
      },

      setFilterEQKey: function (aFilters, oInput) {
        if (oInput?.getSelectedKey()) {
          aFilters.push(
            new Filter(
              oInput.data("searchPropertyModel"),
              EQ,
              oInput.getSelectedKey()
            )
          );
        }
      },

      setFilterEQValue: function (aFilters, oInput) {
        if (oInput?.getValue()) {
          aFilters.push(
            new Filter(
              oInput.data("searchPropertyModel"),
              EQ,
              oInput.getValue()
            )
          );
        }
      },

      setFilterEQKeyMC: function (aFilters, oInput) {
        if (oInput?.data("key")) {
          aFilters.push(
            new Filter(
              oInput.data("searchPropertyModel"),
              EQ,
              oInput.data("key")
            )
          );
        }
      },

      setFilterMultiInputEQText: function (aFilters, oInput) {
        if (oInput.getTokens().length !== 0) {
          oInput.getTokens().map((oRow) => {
            if (oRow.getText()) {
              aFilters.push(
                new Filter(
                  oInput.data("searchPropertyModel"),
                  EQ,
                  oRow.getText()
                )
              );
            }
          });
        }
      },

      setFilterMultiComboBoxEQKey: function (aFilters, oInput) {
        if (oInput.getSelectedItems().length !== 0) {
          oInput.getSelectedItems().map((oRow) => {
            if (oRow.getKey()) {
              aFilters.push(
                new Filter(
                  oInput.data("searchPropertyModel"),
                  EQ,
                  oRow.getKey()
                )
              );
            }
          });
        }
      },

      checkBTFilter: function (aFilters) {
        var oBundle = this.getResourceBundle();

        var oIntervalFilters = aFilters.filter((oFilter) => {
          if (
            oFilter?.sOperator === "BT" &&
            (!oFilter?.oValue1 || !oFilter?.oValue2)
          ) {
            return oFilter;
          }
        });

        if (oIntervalFilters.length > 0) {
          return (
            oBundle.getText("checkBTFilter") +
            " " +
            oBundle.getText("label" + oIntervalFilters[0]?.sPath)
          );
        }

        return;
      },

      /** ----------------GESTIONE PAGINAZIONE-------------------- */

      getChangePage: function (oEvent, modelName) {
        var oPaginatorModel = this.getModel(modelName);
        var numRecordsForPage =
          oPaginatorModel.getProperty("/numRecordsForPage");
        var maxPage = oPaginatorModel.getProperty("/maxPage");
        var currentPage = oEvent.getSource().getValue();
        var bLastEnabled = true;
        var bFirstEnabled = true;

        oPaginatorModel.setProperty(
          "/paginatorSkip",
          (currentPage - 1) * numRecordsForPage
        );

        if (currentPage === maxPage) {
          bLastEnabled = false;
          bFirstEnabled = true;
        } else if (currentPage === 1) {
          bFirstEnabled = false;
          if (currentPage < maxPage) {
            bLastEnabled = true;
          }
        } else if (currentPage > maxPage) {
          bLastEnabled = false;
        }

        oPaginatorModel.setProperty("/btnLastEnabled", bLastEnabled);
        oPaginatorModel.setProperty("/btnFirstEnabled", bFirstEnabled);
      },

      getLastPaginator: function (modelName) {
        var oPaginatorModel = this.getModel(modelName);
        var numRecordsForPage =
          oPaginatorModel.getProperty("/numRecordsForPage");
        var paginatorTotalPage = oPaginatorModel.getProperty(
          "/paginatorTotalPage"
        );
        var paginatorClick = paginatorTotalPage;

        oPaginatorModel.setProperty("/btnLastEnabled", false);
        oPaginatorModel.setProperty("/btnFirstEnabled", true);

        oPaginatorModel.setProperty("/paginatorClick", paginatorClick);
        oPaginatorModel.setProperty(
          "/paginatorSkip",
          (paginatorClick - 1) * numRecordsForPage
        );
        oPaginatorModel.setProperty(
          "/currentPage",
          paginatorTotalPage === 0 ? 1 : paginatorTotalPage
        );
      },

      getFirstPaginator: function (modelName) {
        var oPaginatorModel = this.getModel(modelName);

        oPaginatorModel.setProperty("/btnLastEnabled", true);
        oPaginatorModel.setProperty("/btnFirstEnabled", false);

        oPaginatorModel.setProperty("/paginatorClick", 0);
        oPaginatorModel.setProperty("/paginatorSkip", 0);
        oPaginatorModel.setProperty("/currentPage", 1);
      },

      resetPaginator: function (oPaginatorModel) {
        oPaginatorModel.setProperty("/btnPrevEnabled", false);
        oPaginatorModel.setProperty("/btnFirstEnabled", false);
        oPaginatorModel.setProperty("/btnNextEnabled", false);
        oPaginatorModel.setProperty("/btnLastEnabled", false);
        oPaginatorModel.setProperty("/recordForPageEnabled", false);
        oPaginatorModel.setProperty("/currentPageEnabled", true);
        oPaginatorModel.setProperty("/currentPage", 1);
        oPaginatorModel.setProperty("/maxPage", 1);
        oPaginatorModel.setProperty("/paginatorClick", 0);
        oPaginatorModel.setProperty("/paginatorSkip", 0);
        oPaginatorModel.setProperty("/paginatorTotalPage", 1);
      },

      setPaginatorVisible: function (oPaginatorModel, oData) {
        if (oData?.results.length > 0) {
          oPaginatorModel.setVisible(true);
        } else {
          oPaginatorModel.setVisible(false);
        }
      },

      setPaginatorProperties: function (
        oPaginatorModel,
        oData,
        iNumRecordsForPage
      ) {
        if (oData > iNumRecordsForPage) {
          oPaginatorModel.setProperty("/btnLastEnabled", true);

          var paginatorTotalPage = oData / iNumRecordsForPage;
          var moduleN = Number.isInteger(paginatorTotalPage);

          if (!moduleN) {
            paginatorTotalPage = Math.trunc(paginatorTotalPage) + 1;
          }
          oPaginatorModel.setProperty(
            "/paginatorTotalPage",
            paginatorTotalPage
          );
          oPaginatorModel.setProperty("/maxPage", paginatorTotalPage);
        } else {
          oPaginatorModel.setProperty("/maxPage", 1);
          oPaginatorModel.setProperty("/btnLastEnabled", false);
        }
      },
    });
  }
);
