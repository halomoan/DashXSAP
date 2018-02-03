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
			countries : [{"name": "<All Countries>","coordinate":"50;10;0"},
						 {"name": "Singapore","coordinate":"103.855800000000;1.310550000000;10"},
						 {"name": "Malaysia","coordinate":"101.712458000000;3.144652000000;5"},
						 {"name": "China","coordinate":"101.712458000000;35.144652000000;4"},
						 {"name": "Vietnam","coordinate":"101.712458000000;15.144652000000;5"},
						 {"name": "Myanmar","coordinate":"98.712458000000;22.144652000000;5"},
						 {"name": "Australia","coordinate":"132.712458000000;-25.144652000000;5"}],
								
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
					countries: this.countries
				});
				
				this.setModel(oViewModel, "detailView");
				// set the device model
				var oDeviceModel = new JSONModel(Device);
				oDeviceModel.setDefaultBindingMode("OneWay");
				this.getView().setModel(oDeviceModel, "device");
				
				this.byId("setFocus").setValue("<All Countries>");
				
				this._oModel = this.getOwnerComponent().getModel();
				this.getRouter().getRoute("geoView01").attachPatternMatched(this._onObjectMatched, this);
				
				
			},
			
			onSetFocus: function(e){
				
				var key = e.getSource().getSelectedKey();
				var coord = key.split(";");
				this.byId("vbi").zoomToGeoPosition(coord[0],coord[1],coord[2]);
				this.byId("topPanel").setExpanded(false);
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
				var geomap = this.byId("vbi");
				var code = e.getParameter("code");
				var coord,name;
				switch(code){
					case "SG": name = this.countries[1].name; coord = this.countries[1].coordinate.split(";"); break;
					case "MY": name = this.countries[2].name; coord = this.countries[2].coordinate.split(";"); break;
					case "CN": name = this.countries[3].name; coord = this.countries[3].coordinate.split(";"); break;
					case "VN": name = this.countries[4].name; coord = this.countries[4].coordinate.split(";"); break;
					case "MM": name = this.countries[5].name; coord = this.countries[5].coordinate.split(";"); break;
					case "AU": name = this.countries[6].name; coord = this.countries[6].coordinate.split(";"); break;
					default: coord = this.countries[0].coordinate.split(";"); break;
				}
				this.byId("setFocus").setValue(name);
				geomap.zoomToGeoPosition(coord[0],coord[1],coord[2]);
			},
			onClickCircle: function (e)	{
				//console.log(e.getSource().getBindingContext("geoData").getProperty("pos"));
				var spos =e.getSource().getBindingContext("geoData").getProperty("pos");
				var arrpos = spos.split(';');
				var geomap = this.byId("vbi");
				geomap.zoomToGeoPosition(arrpos[0],arrpos[1],5);
			
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
				
				oViewModel.setProperty("/spotItems",oSpot.getBindingContext("geoData").getProperty("dataset"));
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
					        //console.log(oData);
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