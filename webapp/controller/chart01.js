sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller,JSONModel) {
	"use strict";
	
	jQuery.sap.declare("sap.ui.dashxsap.controller.chart01");
	return Controller.extend("sap.ui.dashxsap.controller.chart01", {
		
		sChartType : "chart",
		_createFilter: function(sKey,sValue){
			return new sap.ui.model.Filter({
						path: sKey,
        				operator: sap.ui.model.FilterOperator.EQ,
        				value1: sValue
			});	
		},
		onInit: function(oThis,sId) {
				var oViewModel = new JSONModel({
						busy : false,
						delay : 0
				});
				
				this.oParent = oThis;
				this.sChartType = sId;
				this.oParent.setModel(oViewModel, this.sChartType + "View");
				
		},
		refreshData: function(sParam){
			var oModelJson = new JSONModel();
			var oView = this.oParent.getView();
			var oThis = this;
			var oViewModel = this.oParent.getModel(this.sChartType + "View");
			var filters = [];
			filters.push(this._createFilter("ChartType",this.sChartType));
			
			oViewModel.setProperty("/busy", true);
			this.oParent.getModel().read("/" + sParam + "/DashXItems", {
					method: "GET",
					filters : filters,
					success: function(oData) {
						
						oModelJson.setData(oData.results[0]);
						
						oView.setModel(oModelJson,oThis.sChartType + "Data");
						
						oViewModel.setProperty("/busy", false);
					},
					error: function() {
						
						oViewModel.setProperty("/busy", false);
					}
				});
		}
	});
});