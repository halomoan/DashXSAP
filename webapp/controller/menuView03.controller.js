sap.ui.define([
	 "sap/ui/dashxsap/controller/BaseController",
     'sap/ui/model/json/JSONModel',
     'sap/viz/ui5/data/FlattenedDataset',
     'sap/viz/ui5/controls/common/feeds/FeedItem',
     'sap/viz/ui5/format/ChartFormatter',
     'sap/viz/ui5/api/env/Format',
     "sap/ui/Device",
     "sap/ui/dashxsap/model/Formatter"
     
], function(BaseController, JSONModel, FlattenedDataset, FeedItem, ChartFormatter, Format,Device,Formatter) {
	"use strict";

	return BaseController.extend("sap.ui.dashxsap.controller.menuView03", {
		
	    settingsModel : {
				chartType : {
					values: [{
                    key : "0",
                    name : "Column Chart",
                    vizType : "timeseries_line",
                    value : "{chartData>/legend}",
                    dataset : {
                       dimensions: [{
                           name: 'Date',
                           value: "{chartData>date}",
                           dataType:'date'
                       }],
                       measures: [{
                    		name: '{chartData>/legend/0}',
                            value: '{chartData>kf1}'
                       },{
                            name: '{chartData>/legend/1}',
                            value: '{chartData>kf2}'
                       }],
                       data: '{chartData>/dataset}'
                    },
                    vizProperties : {
                        plotArea: {
                            dataLabel: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
                                visible: false
                            },
                            window: {
                                start: "firstDataPoint",
                                end: "lastDataPoint"
                            }
                        },
                        valueAxis: {
                            label: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
                            },
                            title: {
                                visible: false
                            }
                        },
                        title: {
                            visible: false
                        }
                    }
                }]
			}            
		},
		oVizFrame : null, menuId: null, sCoCode: null, oModelChart: null,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sap.ui.dashxsap.view.timeAxis01
		 */
		onInit: function() {
				
				// View Model
				var oDefDate = new Date(2017,4,31);
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					title : "",
					oDate : oDefDate,
					formattedDate : Formatter.formatDate(oDefDate),
					cocode: "",
					kf : "MTD",
					qrow : "",
					submenus : [],
					chartTypes: {"defaultSelected": "timeseries_line", "values" : [{"key": "timeseries_line", "type": "Line Chart"},{"key": "timeseries_column", "type": "Bar Chart"}]}
				});
				this.setModel(oViewModel, "detailView");
				
				this.initPageSettings(this.getView());
				
				
				// set the device model
				var oDeviceModel = new JSONModel(Device);
				oDeviceModel.setDefaultBindingMode("OneWay");
				this.getView().setModel(oDeviceModel, "device");
				
				
				Format.numericFormatter(ChartFormatter.getInstance());
				 // set explored app's demo model on this sample
            	var oModel = new JSONModel(this.settingsModel);
            	oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
            	this.getView().setModel(oModel,"chartConfig");
            
				var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            	oVizFrame.setVizProperties(this.settingsModel.chartType.values[0].vizProperties);
            	

				var oPopOver = this.getView().byId("idPopOver");
	            oPopOver.connect(oVizFrame.getVizUid());
	            oPopOver.setFormatString({
	                "KF2": ChartFormatter.DefaultPattern.STANDARDFLOAT,
	                "KF1": ChartFormatter.DefaultPattern.STANDARDFLOAT
	            });
	            
				
				
				this.getRouter().getRoute("menuView03").attachPatternMatched(this._onObjectMatched, this);



		},
			
		_onObjectMatched: function(oEvent){
					this.menuId =  oEvent.getParameter("arguments").objectId;
					
					var oViewModel = this.getModel("detailView");
					var oThis = this;
					
					this.getModel().metadataLoaded().then( function() {
					
						var sObjectPath = this.getModel().createKey("DashXMainMenus", {
							DashXMainMenuID :  this.menuId
						});
						
						
						this.getModel().read("/" + sObjectPath + "/DashXItems", {
						    method: "GET",
						    success: function(oData) {
						    	oViewModel.setProperty("/busy", false);
								//Global Variable
								window.rest_url = oData.results[0].uri;
								
								
								var submenus = oData.results[0].submenus;
							    oViewModel.setProperty("/submenus",submenus);
							    oViewModel.setProperty("/qrow",submenus[0].text);
							    
								var cocode = oViewModel.getProperty("/cocode");
								if (cocode) {
									oThis.refreshData();
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
		refreshData: function(){
			var oVizFrame = this.oVizFrame;
			var oViewModel = this.getModel("detailView");
			var oModelJson = new JSONModel();
			var oDate = oViewModel.getProperty("/oDate");
			var sDate = this.dateFormat(oDate);
			
			oViewModel.setProperty("/busy", true);
			
			var parameters = {
				"MNU": this.menuId,
				"qe": this.sCoCode,
				"qd" : sDate,
				"qkf" : oViewModel.getProperty("/kf"),
				"qrow" : oViewModel.getProperty("/qrow")
			};
			
			
			oModelJson.attachRequestCompleted(function() {
				
				console.log(oModelJson.getData());
				
				oVizFrame.setModel(oModelJson,"chartData");
				
				console.log(oVizFrame);
			
				oViewModel.setProperty("/busy", false);
				
			});
			
			oModelJson.attachRequestFailed(function() {
				alert("Failed to contact SAP BW Server!");
				oViewModel.setProperty("/busy", false);
			});
			
			oViewModel.setProperty("/busy", true);
			
			oModelJson.loadData(window.rest_url,parameters,true, "GET", false, false);
				
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
		searchCoCode: function(oEvent){
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("MyCoCodeID", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		selectCoCode: function(oEvent) {
			var oViewModel = this.getModel("detailView");
			var aContexts = oEvent.getParameter("selectedContexts");
			
			if (aContexts.length) {
				this.oFilters = [];
				aContexts.map(function(oContext) { 
					this.sCoCode = oContext.getObject().MyCoCodeID;
					oViewModel.setProperty("/selectedCoCode", oContext.getObject().MyCoCodeID);
					oViewModel.setProperty("/title",oContext.getObject().ShortText  + " (" +  oContext.getObject().MyCoCodeID + ")");
				}.bind(this));
			}
			oEvent.getSource().getBinding("items").filter([]);
			if (this.sCoCode) {
				this.refreshData();
			}
		},
		// onCoCodeChange: function(oEvent){
		// 	this.sCoCode = oEvent.getSource().getSelectedKey();
		// 	var text = oEvent.getSource().getSelectedItem().getText();
			
		// 	var oViewModel = this.getModel("detailView");
		// 	oViewModel.setProperty("/title",text.substring(7,100) + " (" + this.sCoCode + ") *");
		// },
		onSelRowChange : function(oEvent){
			var key = oEvent.getSource().getSelectedKey();
			var oViewModel = this.getModel("detailView");
			oViewModel.setProperty("/qrow",key);
		},
		onChartTypeChanged : function(oEvent){
			 if(this.oVizFrame){
                var selectedKey = oEvent.getSource().getSelectedKey();
                var bindValue = this.settingsModel.chartType.values[0];
               
               
              
                this.oVizFrame.destroyDataset();
                this.oVizFrame.destroyFeeds();
                this.oVizFrame.setVizType(selectedKey);
                this.oVizFrame.setModel(this.oModelChart,"chartData");
                var oDataset = new FlattenedDataset(bindValue.dataset);
                this.oVizFrame.setDataset(oDataset);
                
                
                var props = bindValue.vizProperties;
                if (selectedKey !== 8 && props.plotArea) {
                	props.plotArea.dataPointStyle = null;
                }
                this.oVizFrame.setVizProperties(props);
                var feedValueAxis, feedValueAxis2, feedActualValues, feedTargetValues;
                if (selectedKey === 7) {
                    feedValueAxis = new FeedItem({
                        'uid': "valueAxis",
                        'type': "Measure",
                        'values': [bindValue.value[0]]
                    });
                    feedValueAxis2 = new FeedItem({
                        'uid': "valueAxis2",
                        'type': "Measure",
                        'values': [bindValue.value[1]]
                    });
                } else if (selectedKey === 8) {
                    feedActualValues = new FeedItem({
                        'uid': "actualValues",
                        'type': "Measure",
                        'values': [bindValue.value[0]]
                    });
                    feedTargetValues = new FeedItem({
                        'uid': "targetValues",
                        'type': "Measure",
                        'values': [bindValue.value[1]]
                    });
                } else {
                    feedValueAxis = new FeedItem({
                        'uid': "valueAxis",
                        'type': "Measure",
                        'values': bindValue.value
                    });
                }

                var feedTimeAxis = new FeedItem({
                    'uid': "timeAxis",
                    'type': "Dimension",
                    'values': ["Date"]
                }),
                feedBubbleWidth = new FeedItem({
                    "uid": "bubbleWidth",
                    "type": "Measure",
                    "values": ["Revenue"]
                });
                switch(selectedKey){
                    case 0:
                        this.oVizFrame.addFeed(feedValueAxis);
                        this.oVizFrame.addFeed(feedTimeAxis);
                        this.oVizFrame.addFeed(feedBubbleWidth);
                        break;
                    case 7:
                        this.oVizFrame.addFeed(feedValueAxis);
                        this.oVizFrame.addFeed(feedValueAxis2);
                        this.oVizFrame.addFeed(feedTimeAxis);
                        break;
                    case 8:
                        this.oVizFrame.addFeed(feedActualValues);
                        this.oVizFrame.addFeed(feedTargetValues);
                        this.oVizFrame.addFeed(feedTimeAxis);
                    default:
                        this.oVizFrame.addFeed(feedValueAxis);
                        this.oVizFrame.addFeed(feedTimeAxis);
                        break;
                }
            
			 }
		},
		initPageSettings : function(oView) {
				// Hide Settings Panel for phone
				if (sap.ui.Device.system.phone) {
					var oSettingsPanel = oView.byId('settingsPanel');
					if(oSettingsPanel){
						oSettingsPanel.setExpanded(false);
					}
				}

				// try to load sap.suite.ui.commons for using ChartContainer
				// sap.suite.ui.commons is available in sapui5-sdk-dist but not in demokit
				var bSuiteAvailable = jQuery.sap.sjax({
					type : "HEAD",
					url : sap.ui.resource("sap.suite.ui.commons", "library.js")
				}).success;
				
				if (bSuiteAvailable) {
					sap.ui.getCore().loadLibrary("sap.suite.ui.commons");
					var vizframe = oView.byId("idVizFrame");
					var oChartContainerContent = new sap.suite.ui.commons.ChartContainerContent({
						icon : "sap-icon://horizontal-bar-chart",
						title : "vizFrame Bar Chart Sample",
						content : [ vizframe ]
					});
					
					var oChartContainer = new sap.suite.ui.commons.ChartContainer({
						content : [ oChartContainerContent ]
					});
					oChartContainer.setShowFullScreen(true);
					oChartContainer.setAutoAdjustHeight(true);
					oView.byId('chartFixFlex').setFlexContent(oChartContainer);
				}
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf sap.ui.dashxsap.view.timeAxis01
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf sap.ui.dashxsap.view.timeAxis01
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf sap.ui.dashxsap.view.timeAxis01
		 */
		onExit: function() {
			if (this._oSelectCoCode) {
				this._oSelectCoCode.destroy();
			}
			if(this.oVizFrame) {
				this.oVizFrame.destroy();
			}
		}

	});

});