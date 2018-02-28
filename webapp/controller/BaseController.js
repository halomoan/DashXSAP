/*global history */
sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History"
	], function (Controller, History) {
		"use strict";

		return Controller.extend("sap.ui.dashxsap.controller.BaseController", {
			
			countries : [{"id": "<ALL>", "name": "<All Countries>","coordinate":"50;10;0"},
						 {"id": "<SG>", "name": "Singapore","coordinate":"103.855800000000;1.310550000000;10"},
						 {"id": "<MY>", "name": "Malaysia","coordinate":"101.712458000000;3.144652000000;5"},
						 {"id": "<CN>", "name": "China","coordinate":"101.712458000000;35.144652000000;4"},
						 {"id": "<VN>", "name": "Vietnam","coordinate":"101.712458000000;15.144652000000;5"},
						 {"id": "<MM>", "name": "Myanmar","coordinate":"98.712458000000;22.144652000000;5"},
						 {"id": "<BD>", "name": "Bangladesh","coordinate":"90.412458000000;23.844652000000;6"},
						 {"id": "<PH>", "name": "Philippines","coordinate":"122.9842;14.5995;6"},
						 {"id": "<AU>", "name": "Australia","coordinate":"132.712458000000;-25.144652000000;5"}],
						 
			/**
			 * Convenience method for accessing the router in every controller of the application.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter : function () {
				return this.getOwnerComponent().getRouter();
			},

			/**
			 * Convenience method for getting the view model by name in every controller of the application.
			 * @public
			 * @param {string} sName the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel : function (sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model in every controller of the application.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			/**
			 * Convenience method for getting the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle : function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			},

			/**
			 * Event handler for navigating back.
			 * It there is a history entry we go one step back in the browser history
			 * If not, it will replace the current entry of the browser history with the master route.
			 * @public
			 */
			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash();

					if (sPreviousHash !== undefined) {
					history.go(-1);
				} else {
					this.getRouter().navTo("master", {}, true);
				}
			},
			
			dateFormat: function(oDate,sFormat){
				var dd = oDate.getDate();
				var MM = oDate.getMonth() + 1;
				var yyyy = oDate.getFullYear();
				
				MM = MM < 10 ? '0' + MM : MM;
				dd = dd < 10 ? '0' + dd : dd;
				
				if (sFormat === "yyyy/MM/dd") {
					return yyyy+"/" + MM + "/" + dd;
				} else {
					return dd + "." + MM + "." + yyyy;
				}
				
			},
			createFilter: function(sKey,sOpr,sValue){
				return new sap.ui.model.Filter({
							path: sKey,
	        				operator: sOpr,
	        				value1: sValue
				});	
			}

		});

	}
);