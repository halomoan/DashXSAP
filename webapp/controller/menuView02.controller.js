sap.ui.define([
	"sap/ui/dashxsap/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Label",
	"sap/m/Text",
	"sap/ui/layout/VerticalLayout",
	"sap/ui/dashxsap/model/Formatter"
], function(BaseController,JSONModel,Dialog,Button,Label,Text,VerticalLayout,Formatter) {
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
					
					this.getModel().read("/" + sObjectPath + "/DashXItems", {
					    method: "GET",
					    success: function(oData) {
					    	oViewModel.setProperty("/busy", false);
							//Global Variable
							window.rest_url = oData.results[0].uri;
							oThis._refreshData();
					    },
					    error: function() {
							oViewModel.setProperty("/busy", false);
					    }
					});
				}.bind(this));
				
			},
			_refreshData : function(){
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
					oViewModel.setProperty("/busy", false);
					oView.setModel(oModelJson,"entityData");
				});
				
				oModelJson.attachRequestFailed(function() {
					alert("Failed to contact SAP BW Server!");
					oViewModel.setProperty("/busy", false);
				});
				
				oViewModel.setProperty("/busy", true);
				
				oModelJson.loadData(window.rest_url,parameters,true, "GET", false, false);
			},
			
			pressTile: function(oEvent){
				var oCtx = oEvent.getSource().getBindingContext("entityData");
				
				var dialog = new Dialog({
					title: oCtx.getProperty("header"),
					type: "Message",
					contentWidth: "auto",
					content: [
						new sap.ui.layout.Grid({
						
							content: [
								new VerticalLayout({
									width: "10em",
									content: [
										new Label({ text: "Current Actual"}),
										new Label({ text: Formatter.currencyValue(oCtx.getProperty("kf1"),oCtx.getProperty("unit")), design: "Bold"})
										.addStyleClass("font150"),
										new Label({ text: oCtx.getProperty("unit")})
									],
									layoutData : new sap.ui.layout.GridData({
            							 span : "L4 M5 S12"
            						})
								}),
								new VerticalLayout({
									width: "10em",
									content: [
										new Label({ text: " VS ",width: "10em",  textAlign : sap.ui.core.TextAlign.Center})
									],
									layoutData : new sap.ui.layout.GridData({
            							 span : "L4 M2 S12"
            						})
								}),
								new VerticalLayout({
									width: "10em",
									content: [
										new Label({ text: "Last Year Actual", 	width: "10em",  textAlign : sap.ui.core.TextAlign.End}),
										new Label({ text: Formatter.currencyValue(oCtx.getProperty("kf2"),oCtx.getProperty("unit")), width: "10em", design: "Bold", textAlign : sap.ui.core.TextAlign.End })
											.addStyleClass("font150"),
										new Label({ text: oCtx.getProperty("unit"), width: "10em", textAlign : sap.ui.core.TextAlign.End})
									],
									layoutData : new sap.ui.layout.GridData({
            							 span : "L4 M5 S12"
            						})
								})
							]
						})
					],
				beginButton: new Button({
					text: 'Close',
					press: function () {
						dialog.close();
					}
				}),			
				afterClose: function() {
					dialog.destroy();
				}
			});
 
			dialog.open();
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