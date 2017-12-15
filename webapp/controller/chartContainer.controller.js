sap.ui.define([
	"sap/ui/dashxsap/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(BaseController,JSONModel,Device) {
	"use strict";
    
    jQuery.sap.require("sap.ui.dashxsap.controller.chart01");
    jQuery.sap.require("sap.ui.dashxsap.controller.chart02");
    jQuery.sap.require("sap.ui.dashxsap.controller.chart03");
    jQuery.sap.require("sap.ui.dashxsap.controller.chart04");
    
	return BaseController.extend("sap.ui.dashxsap.controller.chartContainer", {
		sRegion : "",
		sODataKey : "",
		onRegionChange: function(oEvent) {
			this.sRegion = oEvent.getSource().getSelectedKey();
			var oParams = { "ODataKey" : this.sODataKey, "Region" : this.sRegion };
			this._refreshCharts(oParams);
		},
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sap.ui.dashxsap.view.chartContainer
		 */
		_onObjectMatched: function(oEvent){
		
			var sObjectId =  oEvent.getParameter("arguments").objectId;
			
			this.getModel().metadataLoaded().then( function() {
				
				var sObjectPath = this.getModel().createKey("DashXMainMenus", {
						DashXMainMenuID :  sObjectId
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
			
			this.oCtrl1.refreshData(oParams);
			this.oCtrl2.refreshData(oParams);
			this.oCtrl3.refreshData(oParams);
			this.oCtrl4.refreshData(oParams);
		},
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
				
			this.oCtrl1 = new sap.ui.dashxsap.controller.chart01();
			var layout1 = this.byId("v1");
			
			var oFragment1 = sap.ui.xmlfragment("chart01","sap.ui.dashxsap.view.chart01",this.oCtrl1);
			layout1.addContent(oFragment1);
			this.oCtrl1.onInit(this,"chart01");
			
			this.oCtrl2 = new sap.ui.dashxsap.controller.chart02();
			var layout2 = this.byId("v2");
			
			var oFragment2 = sap.ui.xmlfragment("chart02","sap.ui.dashxsap.view.chart02",this.oCtrl2);
			layout2.addContent(oFragment2);
			this.oCtrl2.onInit(this,"chart02");
			
			this.oCtrl3 = new sap.ui.dashxsap.controller.chart03();
			var layout3 = this.byId("v3");
			
			var oFragment3 = sap.ui.xmlfragment("chart03","sap.ui.dashxsap.view.chart03",this.oCtrl3);
			layout3.addContent(oFragment3);
			this.oCtrl3.onInit(this,"chart03");
			
			this.oCtrl4 = new sap.ui.dashxsap.controller.chart04();
			var layout4 = this.byId("v4");
			
			var oFragment4 = sap.ui.xmlfragment("chart04","sap.ui.dashxsap.view.chart04",this.oCtrl4);
			layout4.addContent(oFragment4);
			this.oCtrl4.onInit(this,"chart04");
			
			
			/*this.oCtrl2 = new sap.ui.dashxsap.controller.chart02();
			var layout2 = this.byId("v2");
			
			var oFragment2 = sap.ui.xmlfragment("chart02","sap.ui.dashxsap.view.chart02",this.oCtrl2);
			layout2.addContent(oFragment2);
			this.oCtrl2.onInit(this,"chart02");*/
			
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