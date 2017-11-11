sap.ui.define([
	"sap/ui/dashxsap/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(BaseController,JSONModel,Device) {
	"use strict";

	return BaseController.extend("sap.ui.dashxsap.controller.chartContainer", {
		selectionChanged: function(oEvent) {
			alert('Yes');
		},
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sap.ui.dashxsap.view.chartContainer
		 */
		_onObjectMatched: function(oEvent){
			var oViewModel = this.getModel("detailView");
			var sObjectId =  oEvent.getParameter("arguments").objectId;
			var oView = this.getView();
			var oModelJson = new JSONModel();
			
			this.getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getModel().createKey("DashXMainMenus", {
						DashXMainMenuID :  sObjectId
				});
				oViewModel.setProperty("/busy", true);
				
				this.getModel().read("/" + sObjectPath + "/DashXItems", {
				method: "GET",
				success: function(oData) {
					
					oModelJson.setData(oData.results[0]);
					
					oView.setModel(oModelJson,"chartData");
					
					oViewModel.setProperty("/busy", false);
				},
				error: function() {
					
					oViewModel.setProperty("/busy", false);
				}
				});
				
			}.bind(this));
		},
		onInit: function() {
			var oViewModel = new JSONModel({
					busy : false,
					delay : 0
				});
				
			this.setModel(oViewModel, "detailView");
			var oDeviceModel = new JSONModel(Device);
				oDeviceModel.setDefaultBindingMode("OneWay");
				this.getView().setModel(oDeviceModel, "device");
			this.getRouter().getRoute("container01").attachPatternMatched(this._onObjectMatched, this);	
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf sap.ui.dashxsap.view.chartContainer
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf sap.ui.dashxsap.view.chartContainer
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf sap.ui.dashxsap.view.chartContainer
		 */
		//	onExit: function() {
		//
		//	}

	});

});