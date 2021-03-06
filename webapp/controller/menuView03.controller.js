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
                name : "Chart Type",
                defaultSelected : "0",
                values : [	
                	{
                    key : "0",
                    name : "Line Chart",
                    vizType : "timeseries_line",
                    value : ["Current Data"],
                    dataset : {
                        dimensions: [{
                            name: "Date",
                            value: "{chartData>date}",
                            dataType:"date"
                        }],
                        measures: [{
                            name: "Current Data",
                            value: "{chartData>kf1}"
                        }],
                        data: {
                            path: "chartData>/dataset"
                        }
                    },
                    vizProperties : {
                        plotArea: {
                            window: {
                                start: "firstDataPoint",
                                end: "lastDataPoint"
                            },
                            dataLabel: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
                                visible: false
                            }
                        },
                        valueAxis: {
                            visible: true,
                            label: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
                            },
                            title: {
                                visible: false
                            }
                        },
                        timeAxis: {
                            title: {
                                visible: false
                            },
                            interval : {
                                unit : ""
                            }
                        },
                        title: {
                            visible: false
                        },
                        interaction: {
                            syncValueAxis: false
                        }
                    }
                	},
                	{
                    key : "1",
                    name : "Combined Column & Line",
                    vizType : "timeseries_combination",
                    value : ["Last Year","Current Year"],
                    dataset : {
                        dimensions: [{
                            name: "Date",
                            value: "{chartData>date}",
                            dataType:"date"
                        }],
                        measures: [{
                            name: "Last Year",
                            value: '{chartData>kf2}'
                        },{
                            name: "Current Year",
                            value: '{chartData>kf1}'
                        }],
                        data: {
                            path: "chartData>/dataset"
                        }
                    },
                    vizProperties : {
                        plotArea: {
                            window: {
                                start: "firstDataPoint",
                                end: "lastDataPoint"
                            },
                            dataLabel: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
                                visible: false
                            }
                        },
                        valueAxis: {
                            visible: true,
                            label: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
                            },
                            title: {
                                visible: false
                            }
                        },
                        timeAxis: {
                            title: {
                                visible: false
                            },
                            interval : {
                                unit : ""
                            }
                        },
                        title: {
                            visible: false
                        },
                        interaction: {
                            syncValueAxis: false
                        }
                    }
                },
                {
                    key : "2",
                    name : "Bullet",
                    vizType : "timeseries_bullet",
                     value : ["Current Year","Last Year"],
                    dataset : {
                        dimensions: [{
                            name: 'Date',
                             value: "{chartData>date}",
                            dataType:'date'
                        }],
                        measures: [{
                            name: "Last Year",
                            value: '{chartData>kf2}'
                        },{
                            name: "Current Year",
                            value: '{chartData>kf1}'
                        }],
                        data: {
                            path: "chartData>/dataset"
                        }
                    },
                    vizProperties : {
                        plotArea: {
                            window: {
                                start: "firstDataPoint",
                                end: "lastDataPoint"
                            },
                            dataLabel: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
                                visible: false
                            },
                            dataPointStyle : {
                                rules : [{
                                    dataContext : { "Current Year" : "*"},
                                    properties : {
                                    	color : "sapUiChartPaletteSequentialHue1Light1"
                                    },
                                    displayName : "Current Year",
                                    dataName : { "Current Year" : "Current Year"}
                                }]
                            }
                        },
                        valueAxis: {
                            visible: true,
                            label: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
                            },
                            title: {
                                visible: false
                            }
                        },
                        valueAxis2: {
                            visible: true,
                            label: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
                            },
                            title: {
                                visible: false
                            }
                        },
                        timeAxis: {
                            title: {
                                visible: false
                            },
                            interval : {
                                unit : ""
                            }
                        },
                        title: {
                            visible: false
                        },
                        interaction: {
                            syncValueAxis: false
                        }
                    }
                },
                {
                    key : "3",
                    name : "Lines Chart",
                    vizType : "dual_line",
                    value : ["Current Year","Last Year"],
                    dataset : {
                        dimensions: [{
                            name: "Date",
                            value: "{chartData>date}",
                            dataType:"date"
                        }],
                        measures: [{
                            name: "Current Year",
                            value: "{chartData>kf1}"
                        },{
                            name: "Last Year",
                            value: "{chartData>kf2}"
                        }],
                        data: {
                            path: "chartData>/dataset"
                        }
                    },
                    vizProperties : {
                        plotArea: {
                            window: {
                                start: "firstDataPoint",
                                end: "lastDataPoint"
                            },
                            dataLabel: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
                                visible: false
                            }
                        },
                        valueAxis: {
                            visible: true,
                            label: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
                            },
                            title: {
                                visible: false
                            }
                        },
						 valueAxis2: {
                            visible: true,
                            label: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
                            },
                            title: {
                                visible: false
                            }
                        },
                        categoryAxis: {
                            title: {
                                visible: false
                            },
                            interval : {
                                unit : ""
                            }
                        },
                        title: {
                            visible: false
                        },
                        interaction: {
                            syncValueAxis: false
                        }
                    }
             }
                ]
            }
		}    
	   ,
		oVizFrame : null, menuId: null, sCoCode: null, oModelChart: null,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sap.ui.dashxsap.view.timeAxis01
		 */
		onInit: function() {
				
				// View Model
				var oDefDate = new Date(new Date().setDate(new Date().getDate()-1));
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					title : "",
					oDate : oDefDate,
					formattedDate : Formatter.formatDate(oDefDate),
					cocode: "",
					cocodetxt: "",
					kf : "MTD",
					kfswitch: true,
					qrow : "",
					submenus : [],
					chartTypes: {"defaultSelected": "0", "values" : [{"key": "0", "type": "Current Year"},{"key": "1", "type": "Current/Last Year"},{"key": "2", "type": "Current/Last Year"},{"key": "3", "type": "Current/Last Year"}]}
				});
				this.setModel(oViewModel, "detailView");
				
				this.initPageSettings(this.getView());
				
				
				// set the device model
				var oDeviceModel = new JSONModel(Device);
				oDeviceModel.setDefaultBindingMode("OneWay");
				this.getView().setModel(oDeviceModel, "device");
				
				this.oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
				this.oStorage.clear();
				
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
							    oThis.oStorage.put("rest_url",oData.results[0].uri);
							    
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
						
						this.getModel().read("/" + sObjectPath + "/DashXSelect", {
						    method: "GET",
						    success: function(oData) {
						    	oViewModel.setProperty("/busy", false);

								var submenus = oData.results;
							    oViewModel.setProperty("/submenus",submenus);
							    oViewModel.setProperty("/qrow",submenus[0].id);
							    oViewModel.setProperty("/title",submenus[0].text);
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
			
			var oDate = oViewModel.getProperty("/oDate");
			var sDate = this.dateFormat(oDate);
			var oModelJson = new JSONModel();
			this.oModelChart = oModelJson;

			oViewModel.setProperty("/busy", true);
			
			var parameters = {
				"MNU": this.menuId,
				"qe": this.sCoCode,
				"qd" : sDate,
				"qkf" : (oViewModel.getProperty("/kfswitch") ? "MTD": "YTD"),
				"qrow" : oViewModel.getProperty("/qrow")
			};
			
			
			oModelJson.attachRequestCompleted(function() {
				
				oVizFrame.setModel(oModelJson,"chartData");

				oViewModel.setProperty("/busy", false);
				
			});
			
			oModelJson.attachRequestFailed(function() {
				sap.m.MessageToast.show("Failed to contact SAP BW Server!");
				oViewModel.setProperty("/busy", false);
			});
			
			oViewModel.setProperty("/busy", true);
			
			var rest_url = this.oStorage.get("rest_url");
			oModelJson.loadData(rest_url,parameters,true, "GET", false, false);
				
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
					oViewModel.setProperty("/cocodetxt",oContext.getObject().ShortText  + " (" +  oContext.getObject().MyCoCodeID + ")");
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
			var text = oEvent.getSource().getSelectedItem().getText();
			var oViewModel = this.getModel("detailView");
			oViewModel.setProperty("/qrow",key);
			oViewModel.setProperty("/title",text);
			this.refreshData();
		},
		onChartTypeChanged : function(oEvent){
			 if(this.oVizFrame){
                var selectedKey = oEvent.getSource().getSelectedKey();
                var bindValue = this.settingsModel.chartType.values[selectedKey];
               
               
                this.oVizFrame.destroyDataset();
                this.oVizFrame.destroyFeeds();
                this.oVizFrame.setVizType(bindValue.vizType);
                this.oVizFrame.setModel(this.oModelChart,"chartData");
                var oDataset = new FlattenedDataset(bindValue.dataset);
                this.oVizFrame.setDataset(oDataset);
                
                var props = bindValue.vizProperties;
                if (selectedKey !== "2" && props.plotArea) {
                	props.plotArea.dataPointStyle = null;
                }
                this.oVizFrame.setVizProperties(props);
                var feedValueAxis, feedValueAxis2, feedActualValues, feedTargetValues;
                if (selectedKey === "3") {
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
                } else if (selectedKey === "2") {
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

				if (selectedKey === "3") {
					var feedTimeAxis = new FeedItem({
	                    'uid': "categoryAxis",
	                    'type': "Dimension",
	                    'values': ["Date"]
	                });
				}else{
	                var feedTimeAxis = new FeedItem({
	                    'uid': "timeAxis",
	                    'type': "Dimension",
	                    'values': ["Date"]
	                }),
	                feedBubbleWidth = new FeedItem({
	                    "uid": "bubbleWidth",
	                    "type": "Measure",
	                    "values": ["Current Data"]
	                });
				}
                switch(selectedKey){
                    case "3":
                        this.oVizFrame.addFeed(feedValueAxis);
                        this.oVizFrame.addFeed(feedValueAxis2);
                        this.oVizFrame.addFeed(feedTimeAxis);
                        break;
                    case "7":
                        this.oVizFrame.addFeed(feedValueAxis);
                        this.oVizFrame.addFeed(feedValueAxis2);
                        this.oVizFrame.addFeed(feedTimeAxis);
                        break;
                    case "2":
                        this.oVizFrame.addFeed(feedActualValues);
                        this.oVizFrame.addFeed(feedTargetValues);
                        this.oVizFrame.addFeed(feedTimeAxis);
                    	break;
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
						title : "Title",
						content : [ vizframe ]
					});
					
					var oChartContainer = new sap.suite.ui.commons.ChartContainer({
						title : "{detailView>/title}",
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