sap.ui.define([
	"sap/ui/dashxsap/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController,JSONModel) {
	"use strict";

	return BaseController.extend("sap.ui.dashxsap.controller.menuView02", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sap.ui.dashxsap.view.menuView02
		 */
			onInit: function() {
				var oDefDate = new Date(2016,1,20);
				var oViewModel = new JSONModel({
						busy : false,
						delay : 0,
						overviewBusy : false,
						roomBusy : false,
						fbBusy : false,
						modBusy : false,
						oDate : oDefDate
				});
				this.setModel(oViewModel,"detailView");
				
				this.getRouter().getRoute("menuView02").attachPatternMatched(this._onObjectMatched, this);
			},
			
			_onObjectMatched: function(oEvent){
				this.menuId =  oEvent.getParameter("arguments").objectId;
				var oViewModel = this.getModel("detailView");
				var oThis = this;
				
				this.getModel().metadataLoaded().then( function() {
					
					oViewModel.setProperty("/busy", true);
					
						
					var sObjectPath = this.getModel().createKey("DashXMainMenus", {
						DashXMainMenuID :  this.menuId
					});
					console.log(sObjectPath);
					this.getModel().read("/" + sObjectPath + "/DashXItems", {
					    method: "GET",
					    success: function(oData) {
							//Global Variable
							window.rest_url = oData.results[0].uri;
							oThis._refreshOverview();
					    },
					    error: function() {
							oViewModel.setProperty("/busy", false);
					    }
					});
				}.bind(this));
				
			},
			_refreshOverview : function(){
				var oView = this.getView();
				var oViewModel = this.getModel("detailView");
				var oDate = oViewModel.getProperty("/oDate");
				var sDate = this.dateFormat(oDate);
				var oModelJson = new JSONModel();
				
				var parameters = {
					"MNU": this.menuId,
					"qe": "2000",
					"qd" : sDate,
					"qkf" : "mtd"
				};
				
				
				oModelJson.attachRequestCompleted(function() {
					oViewModel.setProperty("/overviewBusy", false);
					
					oView.setModel(oModelJson,"dataTiles");
					
				});
				
				oModelJson.attachRequestFailed(function() {
					alert("Failed to contact SAP BW Server!");
					oViewModel.setProperty("/overviewBusy", false);
				});
				
				oViewModel.setProperty("/overviewBusy", true);
				
				oModelJson.loadData(window.rest_url,parameters,true, "GET", false, false);
			},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf sap.ui.dashxsap.view.menuView02
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf sap.ui.dashxsap.view.menuView02
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf sap.ui.dashxsap.view.menuView02
		 */
			onExit: function() {
		
			}

	});

});