sap.ui.define([
		"sap/ui/dashxsap/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/Device"
	], function (BaseController, JSONModel,Device) {
		"use strict";

		return BaseController.extend("sap.ui.dashxsap.controller.App", {

			onInit : function () {
				var oViewModel,
					fnSetAppNotBusy,
					oListSelector = this.getOwnerComponent().oListSelector,
					iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

				oViewModel = new JSONModel({
					busy : true,
					delay : 0
				});
				this.setModel(oViewModel, "appView");
				
				var oDeviceModel = new JSONModel(Device);
				oDeviceModel.setDefaultBindingMode("OneWay");
				this.setModel(oDeviceModel, "device");

				fnSetAppNotBusy = function() {
					oViewModel.setProperty("/busy", false);
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				};

				this.getOwnerComponent().getModel().metadataLoaded()
						.then(fnSetAppNotBusy);

				// Makes sure that master view is hidden in split app
				// after a new list entry has been selected.
				oListSelector.attachListSelectionChange(function () {
					this.byId("idAppControl").hideMaster();
				}, this);

				
					
				// apply content density mode to root view
				this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			}

		});

	}
);