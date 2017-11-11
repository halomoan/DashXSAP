sap.ui.define([
	"sap/ui/dashxsap/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/vbm/AnalyticMap",
	"sap/ui/Device"
], function(BaseController,JSONModel,AnalyticMap,Device) {
	"use strict";

	return BaseController.extend("sap.ui.dashxsap.controller.geoView01", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sap.ui.dashxsap.view.geoView01
		 */
			onInit: function() {
				/* Test Json
				var oModel = new sap.ui.model.json.JSONModel("localService/mockdata/Data.json");
		    	this.getView().setModel(oModel);
		    	*/
				
				// View Model
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					spotItems :[],
					yesterday : "30/Nov/2017",
					countries: [{"name": "<All Countries>","coordinate":"50;10;0"},
								{"name": "Singapore","coordinate":"103.855800000000;1.310550000000;10"},
								{"name": "Malaysia","coordinate":"101.712458000000;3.144652000000;5"}]
				});
				
				this.setModel(oViewModel, "detailView");
				// set the device model
				var oDeviceModel = new JSONModel(Device);
				oDeviceModel.setDefaultBindingMode("OneWay");
				this.getView().setModel(oDeviceModel, "device");
				
				this._oModel = this.getOwnerComponent().getModel();
				this.getRouter().getRoute("geoView01").attachPatternMatched(this._onObjectMatched, this);
				
				
			},
			
			onSetFocus: function(e){
				var key = e.getSource().getSelectedKey();
				var coord = key.split(";");
				this.byId("vbi").zoomToGeoPosition(coord[0],coord[1],coord[2]);
			},
			onPressResize: function() {
				
				this.byId("vbi").zoomToGeoPosition(50,10,0);
				this.byId("vbi").maximize();
					
				
			},
			onLegendClick: function(e){
				//console.log(e.getSource().getBindingContext("geoData").getProperty("name"));
			},
			onRegionClick: function(e) {
				sap.m.MessageToast.show("Country Code: " + e.getParameter("code"));
			},
			onClickCircle: function (e)	{
				//console.log(e.getSource().getBindingContext("geoData").getProperty("pos"));
				var geomap = this.byId("vbi");
				geomap.zoomToGeoPosition(101.71245800000,3.144652000000,5);
			},
			onClickSpot: function(e) {
			
				var oSpot = e.getSource();
				var oViewModel = this.getModel("detailView"); 
				var oView = this.getView();
				var oDialog = oView.byId("moreInfoDialog");
				if (!oDialog) {
		            // create dialog via fragment factory
		            oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.dashxsap.view.geoView01",this);
		            oView.addDependent(oDialog);
		         }
				
				oViewModel.setProperty("/spotItems",oSpot.getBindingContext("geoData").getProperty("DataSet"));
				oViewModel.setProperty("/Name",oSpot.getBindingContext("geoData").getProperty("name"));
				oDialog.open(); 
			},
			
			onCloseDialog: function(e){
				this.getView().byId("moreInfoDialog").close();
			},
			
	
			onContextMenuCircle: function ( evt )	{
				alert("Circle onContextMenu");
			},
			_onObjectMatched: function(oEvent){
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				var oModelJson = new JSONModel();
				var oView = this.getView();
				var oViewModel = this.getModel("detailView");
				
				
				this.getModel().metadataLoaded().then( function() {
					
					var sObjectPath = this.getModel().createKey("DashXMainMenus", {
						DashXMainMenuID :  sObjectId
					});
					
					oViewModel.setProperty("/busy", true);
					
					
					this._oModel.read("/" + sObjectPath + "/DashXItems", {
					    method: "GET",
					    success: function(oData) {
					    	//console.log(oData.results);
					        oModelJson.setData(oData.results[0]);
					    	oView.setModel(oModelJson,"geoData");
					    
					    	oViewModel.setProperty("/busy", false);
							/*var spots = oView.byId("spots");
							console.log(spots.getItems());*/
							
					    },
					    error: function() {
							oViewModel.setProperty("/busy", false);
					    }
					});
					
					
				}.bind(this));
				
			},
			
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf sap.ui.dashxsap.view.geoView01
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf sap.ui.dashxsap.view.geoView01
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf sap.ui.dashxsap.view.geoView01
		 */
			onExit: function() {
				if (this._oPopover) {
					this._oPopover.destroy();
				}	
			}

	});

});
