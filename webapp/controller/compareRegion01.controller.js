sap.ui.define([
	"sap/ui/dashxsap/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController,JSONModel) {
	"use strict";
	
	jQuery.sap.require("sap.ui.dashxsap.controller.barchart"); //Bar Chart

	return BaseController.extend("sap.ui.dashxsap.controller.compareRegion01", {

		oParams : {},
		
		_onObjectMatched: function(oEvent){
		
			var srcId =  oEvent.getParameter("arguments").srcId;
			var sItemId = oEvent.getParameter("arguments").itemId; 
			var sRegion =  oEvent.getParameter("arguments").region;
			var sDate =  oEvent.getParameter("arguments").date;
			var sKeyFigure =  oEvent.getParameter("arguments").kf;
			//console.log(srcId,sItemId,sRegion,sDate,sKeyFigure);
			
			sItemId = sItemId.replace(/^\W+>\W+/g,"");
			
			var oViewModel = this.getModel("detailView");
			oViewModel.setProperty("/region",sRegion);

			this.getModel().metadataLoaded().then( function() {
				
				var sObjectPath = this.getModel().createKey("DashXMainMenus", {
						DashXMainMenuID :  srcId
				});
				var sODataKey = sObjectPath;
			
				/*this.byId("selectRegion").getBinding("items").attachEventOnce("dataReceived", function(){
						this.sRegion = this.byId("selectRegion").getFirstItem().getKey();
						var oParams = { "ODataKey" : this.sODataKey, "Region" : this.sRegion };
						this._refreshCharts(oParams);
				}.bind(this));
				*/
				
				this.oParams = { "ODataKey" : sODataKey, "srcId": srcId, "ItemId" : sItemId, "Region" : sRegion, "Date" : sDate, "KF": sKeyFigure };
				
				this._refreshCharts(this.oParams);
			}.bind(this));
		},
		_refreshCharts : function(oParams) {
			
			var oViewModel = this.getModel("detailView");
			var sRegionId = oViewModel.getProperty("/region");
			
			var oRegion = this.countries.find(function(obj){
					return obj.id === sRegionId;
			});
			
			var sTitle = this.getResourceBundle().getText("region", [oRegion.name]);
			oViewModel.setProperty("/panelTitle", sTitle);
			
			this.barchart.refreshData(oParams);
		},
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sap.ui.dashxsap.view.chartContainer01
		 */
		onInit: function() {
				var oViewModel = new JSONModel({
						panelTitle : this.getResourceBundle().getText("region", [""]),
						countries: this.countries,
						region : "<ALL>",
						busy : false,
						delay : 0
					});
					
				this.setModel(oViewModel, "detailView");
					
				this.barchart = new sap.ui.dashxsap.controller.barchart();
				var layout1 = this.byId("v1");
					
				var oFragment1 = sap.ui.xmlfragment("barchart","sap.ui.dashxsap.view.barchart",this.barchart);
				layout1.addContent(oFragment1);
				this.barchart.onInit(this,"barchart");
			
				this.getRouter().getRoute("compareRegion01").attachPatternMatched(this._onObjectMatched, this);	
		},
		onSetFocus: function(oEvent){
				
				var oViewModel = this.getModel("detailView");
				var key = oEvent.getSource().getSelectedKey();
				var oRegion = this.countries.find(function(obj){
					return obj.id === key;
				});
			
				var sTitle = this.getResourceBundle().getText("region", [oRegion.name]);
				
				oViewModel.setProperty("/panelTitle", sTitle);
				this.byId("settingsPanel").setExpanded(false);
				
				this.oParams.Region = oRegion.id;
			
				this._refreshCharts(this.oParams);
				
		},
		onNavBack: function(){
			
			window.history.go(-1);
				
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