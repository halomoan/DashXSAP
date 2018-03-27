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

	jQuery.sap.require("sap.ui.dashxsap.controller.donut");
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
						oDate : oDefDate,
						formattedDate : Formatter.formatDate(oDefDate),
						cocode : "",
						cotext : "",
						kf : "MTD",
						keyFigures : [{text: "Month To Date"},{text: "Year To Date"}]
				});
				this.setModel(oViewModel,"detailView");
				
				this.oRBE1controller = new sap.ui.dashxsap.controller.donut();
				var rbe1 = this.byId("rbe1");
				
			
				
				var oFragmentRBE1 = sap.ui.xmlfragment("donut","sap.ui.dashxsap.view.donut",this.oRBE1controller);
				rbe1.addContent(oFragmentRBE1);
				this.oRBE1controller.onInit(this,"donut");
				
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
							
							var cocode = oViewModel.getProperty("/cocode");
							if (cocode) {
								oThis._refreshData();
							} else{
								oThis.handleCoCodeSelect();
							}
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
				var oThis = this;
				
				var parameters = {
					"MNU": this.menuId,
					"qe": oViewModel.getProperty("/cocode"),
					"qd" : sDate,
					"qkf" : oViewModel.getProperty("/kf")
				};
				
				
				oModelJson.attachRequestCompleted(function() {
					//console.log(oModelJson.getData());
					oViewModel.setProperty("/busy", false);
					oView.setModel(oModelJson,"entityData");
					oThis.oRBE1controller.refreshData(oModelJson.getData());                         
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
					contentWidth: "30em",
					content: [
						new sap.ui.layout.Grid({
						    hSpacing: 0,
							vSpacing: 0,
							content: [
								new VerticalLayout({
									width: "100%",
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
									width: "100%",
									content: [
										new Label({ text: " VS ",width: "100%", textAlign : sap.ui.core.TextAlign.Center})
									],
									layoutData : new sap.ui.layout.GridData({
            							 span : "L4 M2 S12"
            						})
								}),
								new VerticalLayout({
									width: "100%",
									content: [
										new Label({ text: "Last Year Actual", width: "100%",  textAlign : sap.ui.core.TextAlign.End}),
										new Label({ text: Formatter.currencyValue(oCtx.getProperty("kf2"),oCtx.getProperty("unit")), width: "100%", design: "Bold",textAlign : sap.ui.core.TextAlign.End})
											.addStyleClass("font150"),
										new Label({ text: oCtx.getProperty("unit"), width: "100%", textAlign : sap.ui.core.TextAlign.End})
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
			handleOptSelect: function (oEvent) {
				if (!this._oSelectOpt) {
					this._oSelectOpt = sap.ui.xmlfragment("sap.ui.dashxsap.view.KFPopover", this);
					this.getView().addDependent(this._oSelectOpt);
				}
				this._oSelectOpt.openBy(oEvent.getParameter("domRef"));
				this._oSelectOpt.setModel(this.getModel("detailView"),"detailView");
			},
			selectKeyFigure : function(oEvent){
				var oViewModel = this.getModel("detailView");
				var kf = oEvent.getParameter("listItem").getProperty("title");
				if (kf === "Year To Date") {
					oViewModel.setProperty("/kf","YTD");
				} else{
					oViewModel.setProperty("/kf","MTD");
				}
				
				this._refreshData();
				this._oSelectOpt.close();
			},
			handleCoCodeSelect: function(){
				if (!this._oSelectCoCode) {
					this._oSelectCoCode = sap.ui.xmlfragment("sap.ui.dashxsap.view.myCoCode", this);
					this._oSelectCoCode.setModel(this.getView().getModel());
					this._oSelectCoCode.setRememberSelections(true);
				}
				this._oSelectCoCode.getBinding("items").filter([]);
	
				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oSelectCoCode);
				this._oSelectCoCode.open();
			},
			handleDateSelect: function(oEvent) {
				if (!this._oSelectDate) {
					this._oSelectDate = sap.ui.xmlfragment("sap.ui.dashxsap.view.calpopover", this);
					this.getView().addDependent(this._oSelectDate);
				
				}	
				var oControl = oEvent.getSource();
				this._oSelectDate.openBy(oControl);
					
			},
			selectCoCode: function(oEvent) {
				var oViewModel = this.getModel("detailView");
				var aContexts = oEvent.getParameter("selectedContexts");
				aContexts.map(function(oContext) { 
					oViewModel.setProperty("/cocode",oContext.getObject().MyCoCodeID);
					oViewModel.setProperty("/cotext",oContext.getObject().ShortText);
				});
				this._refreshData();
				
			},
			selectDate: function(oEvent){
				var oViewModel = this.getModel("detailView");
				var sValue = oEvent.getParameter("value");
				oViewModel.setProperty("/formattedDate",sValue);
				var oDP = oEvent.oSource;
				oViewModel.setProperty("/oDate",oDP.getDateValue());
				this._oSelectDate.close();
				this._refreshData();
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
				if (this._oSelectCoCode) {
					this._oSelectCoCode.destroy();
				}
				if (this._oSelectDate) {
					this._oSelectDate.destroy();
				}
				if (this._oSelectOpt) {
					this._oSelectOpt.destroy();
				}
				
			}

	});

});