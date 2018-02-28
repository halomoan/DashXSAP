sap.ui.define([
	"sap/ui/dashxsap/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(BaseController,JSONModel,Device) {
	"use strict";
	
	jQuery.sap.require("sap.ui.dashxsap.controller.stackedBar"); //Stacked Chart

	return BaseController.extend("sap.ui.dashxsap.controller.chartContainer01", {

		_onObjectMatched: function(oEvent){
		
			
			var srcId =  oEvent.getParameter("arguments").srcId;
			var sRegion =  oEvent.getParameter("arguments").region;
			var sDate =  oEvent.getParameter("arguments").date;
			var sKeyFigure =  oEvent.getParameter("arguments").kf;
			
			
			
			console.log(srcId);
			console.log(sDate);
			console.log(sRegion);
			console.log(sKeyFigure);
			this.getModel().metadataLoaded().then( function() {
				
				var sObjectPath = this.getModel().createKey("DashXMainMenus", {
						DashXMainMenuID :  srcId
				});
				this.sODataKey = sObjectPath;
			
				this.byId("selectRegion").getBinding("items").attachEventOnce("dataReceived", function(){
						this.sRegion = this.byId("selectRegion").getFirstItem().getKey();
						var oParams = { "ODataKey" : this.sODataKey, "Region" : this.sRegion };
						this._refreshCharts(oParams);
				}.bind(this));
				
			}.bind(this));
		},
		_refreshCharts : function(oParams) {
			
			var oViewModel = this.getModel("detailView");
			var oSelectedItem = this.byId("selectRegion").getSelectedItem();
			if (!oSelectedItem) {
				oSelectedItem = this.byId("selectRegion").getFirstItem();
			}	
			
			var sTitle = this.getResourceBundle().getText("selection", [oSelectedItem.getText()]);
			oViewModel.setProperty("/panelTitle", sTitle);
			
			this.stackedBar.refreshData(oParams);
		},
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sap.ui.dashxsap.view.chartContainer01
		 */
		onInit: function() {
				var oViewModel = new JSONModel({
						panelTitle : this.getResourceBundle().getText("selection", [""]),
						busy : false,
						delay : 0
					});
					
				this.setModel(oViewModel, "detailView");
				var oDeviceModel = new JSONModel(Device);
					oDeviceModel.setDefaultBindingMode("OneWay");
					this.getView().setModel(oDeviceModel, "device");
					
					this.stackedBar = new sap.ui.dashxsap.controller.stackedBar();
					var layout1 = this.byId("v1");
					
					var oFragment1 = sap.ui.xmlfragment("stackedBar","sap.ui.dashxsap.view.stackedBar",this.stackedBar);
					layout1.addContent(oFragment1);
					this.stackedBar.onInit(this,"stackedBar");
			
					this.getRouter().getRoute("container01").attachPatternMatched(this._onObjectMatched, this);	
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf sap.ui.dashxsap.view.chartContainer01
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf sap.ui.dashxsap.view.chartContainer01
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf sap.ui.dashxsap.view.chartContainer01
		 */
		//	onExit: function() {
		//
		//	}

	});

});