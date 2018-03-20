sap.ui.define([
	"sap/ui/dashxsap/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/dashxsap/model/Formatter"
], function(BaseController,JSONModel,Formatter) {
	"use strict";
	
	jQuery.sap.require("jquery.sap.storage");
	
	return BaseController.extend("sap.ui.dashxsap.controller.menuView01", {
		   itemId : "",
		   menuId : "",
		   oStorage: null,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sap.ui.dashxsap.view.menuView01
		 */
			onInit: function() {
				
				// View Model
				var oDefDate = new Date(2016,1,20);
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					page: "",
					showNav : sap.ui.Device.system.phone,
					spotItems :[],
					oDate : oDefDate,
					region : "<ALL>",
					countries: this.countries,
					dcompares: [{"text" : "Compare Current Date Within Region" },{"text" : "Compare M-T-D Within Region"},{"text" : "Compare Y-T-D Within Region"}]
					
				});
				
				this.oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
				this.oStorage.clear();
				
				this.setModel(oViewModel, "detailView");
				
				this.byId("setFocus").setValue("<All Countries>");
				this.byId("DTP1").setDateValue(oDefDate);
				
				var page2 = this.byId("p2");
				
				var oFragment1 = sap.ui.xmlfragment("chart01","sap.ui.dashxsap.view.geoView01",this);
				page2.addContent(oFragment1);
				
				this._oModel = this.getOwnerComponent().getModel();
				this.getRouter().getRoute("menuView01").attachPatternMatched(this._onObjectMatched, this);
				
			},
			
			onSetFocus: function(e){
				
				var key = e.getSource().getSelectedKey();
				var country = this.countries.find(function(obj){
					return obj.id === key;
				});
			
				var coord = country.coordinate.split(";");
				this.byId("vbi").zoomToGeoPosition(coord[0],coord[1],coord[2]);
				this.byId("settingsPanel").setExpanded(false);
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
					case "BD": name = this.countries[6].name; coord = this.countries[6].coordinate.split(";"); break;
					case "PH": name = this.countries[7].name; coord = this.countries[7].coordinate.split(";"); break;
					case "AU": name = this.countries[8].name; coord = this.countries[8].coordinate.split(";"); break;
					default: coord = this.countries[0].coordinate.split(";"); break;
				}
				this.byId("setFocus").setValue(name);
				geomap.zoomToGeoPosition(coord[0],coord[1],coord[2]);
			},
			onClickCircle: function (e)	{
				var spos = e.getSource().getBindingContext("geoData").getProperty("pos");
				var arrpos = spos.split(";");
				var geomap = this.byId("vbi");
				geomap.zoomToGeoPosition(arrpos[0],arrpos[1],5);
			
			},
			onClickSpot: function(oEvent) {
			
				var oViewModel = this.getModel("detailView"); 
				var oView = this.getView();
				var oSpot = oEvent.getSource();
				var idx = oSpot.getBindingContext("geoData").getProperty("order");
				var arrSpotItems = oView.getModel("geoData").getProperty("/detailset");
				
				oViewModel.setProperty("/spotItems",arrSpotItems[idx - 1].dataset);
				oViewModel.setProperty("/Name",arrSpotItems[idx - 1].name);
				oViewModel.setProperty("/region","<" + arrSpotItems[idx - 1].region + ">");
				
				oViewModel.setProperty("/page","p2");
				if( !sap.ui.Device.system.phone ) {
					oViewModel.setProperty("/showNav",true);
				}
				var navCon = this.getView().byId("navCon");
				navCon.to(this.getView().byId("p2"), "slide");
			
			},
			
			onCloseDialog: function(e){
				this.getView().byId("moreInfoDialog").close();
			},
			
	
			onContextMenuCircle: function ( oEvent )	{
				alert("Circle onContextMenu");
			},
			onDetailPopover : function (oEvent){
				if (!this._oDPopover) {
					this._oDPopover = sap.ui.xmlfragment("sap.ui.dashxsap.view.geoView01popover", this);
					this.getView().addDependent(this._oDPopover);
					/*this._oDPopover.attachAfterOpen(function() {
						this.disablePointerEvents();
					}, this);
					this._oDPopover.attachAfterClose(function() {
						this.enablePointerEvents();
					}, this);
					*/
				}
	
				var oCtx = oEvent.getSource().getBindingContext("detailView");
				
				this.itemId = oCtx.getProperty("text");
				
				
				this._oDPopover.bindElement({ path: oCtx.getPath(), model: "detailView" } );
	
				// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
				var oControl = oEvent.getSource();
				this._oDPopover.openBy(oControl);
			},
			onNavBack: function(){
				
				var oViewModel = this.getModel("detailView"); 
				var sPage = oViewModel.getProperty("/page");
				
				if(sPage === "p2") {
					oViewModel.setProperty("/page","p1");
					if( !sap.ui.Device.system.phone ) {
						oViewModel.setProperty("/showNav",false);
					}
					var navCon = this.getView().byId("navCon");
					navCon.back();		
				} else{
					window.history.go(-1);
				}
				
			},
			onNavToCompare : function(oEvent) {
				var oViewModel = this.getModel("detailView"); 
				
				var oCtx = oEvent.getSource().getBindingContext("detailView");
				var sKey = oCtx.getPath();
				
				var sKFigure = "ctd";
				if (sKey === "/dcompares/1") {
					 sKFigure = "mtd";
				}else if (sKey === "/dcompares/2") {
					 sKFigure = "ytd";
				}
					
				
				
				var sRegion = oViewModel.getProperty("/region");
				var oDate = oViewModel.getProperty("/oDate");
				var sDate = this.dateFormat(oDate);
				var sItemId = this.itemId;
				
				//console.log(oCtx.getPath());
				//console.log(oCtx.getProperty("text"));
				
				this.getRouter().navTo("compareRegion01", {
					
					srcId : "MNUR01",
					itemId : sItemId,
					region : sRegion,
					date: sDate,
					kf: sKFigure
					
				}, false);
			},
			onDTP1change : function (oEvent){
				var oViewModel = this.getModel("detailView");
				var oDP = oEvent.oSource;
				var sValue = oEvent.getParameter("value");
				oViewModel.setProperty("/formattedDate",sValue);
				oViewModel.setProperty("/oDate",oDP.getDateValue());
				this._refreshGeo();
				
			},
			_onObjectMatched: function(oEvent){
				this.menuId =  oEvent.getParameter("arguments").objectId;
				var oViewModel = this.getModel("detailView");
				var oThis = this;
				
				this.getModel().metadataLoaded().then( function() {
					
					
					var menuid = oThis.oStorage.get("menuId");
					
					if (menuid === this.menuId) {
						return;
					} else {
						oThis.oStorage.put("menuId",oThis.menuId);
					}
					
					
					oViewModel.setProperty("/busy", true);
					
					
					var sObjectPath = this.getModel().createKey("DashXMainMenus", {
						DashXMainMenuID :  this.menuId
					});
					
					this._oModel.read("/" + sObjectPath + "/DashXItems", {
					    method: "GET",
					    success: function(oData) {
					       
							//Global Variable
							window.rest_url = oData.results[0].uri;
					    	oThis._refreshGeo();
					    	
					    },
					    error: function() {
							oViewModel.setProperty("/busy", false);
					    }
					});
					
				
					
				}.bind(this));
				
			},
			_refreshGeo : function(){
				
			
				var oViewModel = this.getModel("detailView");
				var oDate = oViewModel.getProperty("/oDate");
				var oView = this.getView();
				var sDate = this.dateFormat(oDate);
				var oModelJson = new JSONModel();
				
				var parameters = {
					"MNU": this.menuId,
					"qe": "<ALL>",
					"qd" : sDate
				};
				
				
				oModelJson.attachRequestCompleted(function() {
					
					oView.setModel(oModelJson,"geoData");
					oViewModel.setProperty("/busy", false);
				
					
				});
				
				oModelJson.attachRequestFailed(function() {
					alert("Failed to contact SAP BW Server!");
					oViewModel.setProperty("/busy", false);
				});
				oViewModel.setProperty("/busy", true);
				
				oModelJson.loadData(window.rest_url,parameters,true, "GET", false, false);
				/*var oHeaders = {
    				"Authorization": "Basic " +  btoa("khalomoan:n3tw0rk1")
				};
				oModelJson.loadData("http://dbwap01.h800.local/sap(bD1lbiZjPTYwMA==)/bc/bsp/sap/zjson_bexquery/bexdata.xml",parameters,true, "GET", false, false, oHeaders);
				*/
				//oModelJson.loadData("http://dbwap01.h800.local/sap(bD1lbiZjPTYwMA==)/bc/bsp/sap/zjson_bexquery/bexdata.xml",parameters,true, "GET", false, false);
					
					
			},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf sap.ui.dashxsap.view.menuView01
		 */
		//	onBeforeRendering: function() {
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf sap.ui.dashxsap.view.menuView01
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf sap.ui.dashxsap.view.menuView01
		 */
			onExit: function() {
			
				if (this._oDPopover) {
					this._oDPopover.destroy();
				}
				if (this.oStorage) {
					this.oStorage.clear();
					this.oStorage = null;
				}
				
			}

	});

});