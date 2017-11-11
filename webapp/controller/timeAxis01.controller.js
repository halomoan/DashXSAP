sap.ui.define([
	 "sap/ui/dashxsap/controller/BaseController",
     'sap/ui/model/json/JSONModel',
     'sap/viz/ui5/data/FlattenedDataset',
     'sap/viz/ui5/controls/common/feeds/FeedItem',
     'sap/viz/ui5/format/ChartFormatter',
     'sap/viz/ui5/api/env/Format',
     'sap/ui/model/Filter',
     "sap/ui/Device"
     
], function(BaseController, JSONModel, FlattenedDataset, FeedItem, ChartFormatter, Format,Filter,Device) {
	"use strict";

	return BaseController.extend("sap.ui.dashxsap.controller.timeAxis01", {
		
	    settingsModel : {
				chartType : {
					values: [{
                    key : "0",
                    name : "Column Chart",
                    vizType : "timeseries_line",
<<<<<<< Upstream, based on 744f4b190c894c235f1bcd0652bc2bc86889f357
                    value : "{chartData>/Legends/1}",
                    dataset : {
                       dimensions: [{
                           name: 'Date',
                           value: "{chartData>Date}",
                           dataType:'date'
                       }],
                       measures: [{
                    		name: '{chartData>/Legends/1/0}',
                            value: '{chartData>KF1}'
                       },{
                            name: '{chartData>/Legends/1/1}',
=======
                    value : "{chartData>/Legends}",
                    dataset : {
                       dimensions: [{
                           name: 'Date',
                           value: "{chartData>Date}",
                           dataType:'date'
                       }],
                       measures: [{
                    		name: '{chartData>/Legends/0}',
                            value: '{chartData>KF1}'
                       },{
                            name: '{chartData>/Legends/1}',
>>>>>>> e49ca65 ChartContainer
                            value: '{chartData>KF2}'
                       }],
                       data: '{chartData>/Data}'
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
		oVizFrame : null, sODataId: null, sCoCode: null, oFromDate: null, oToDate:null, oModelChart: null,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sap.ui.dashxsap.view.timeAxis01
		 */
		onInit: function() {
				
				// View Model
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					title : "",
					delimiterDRS1: "-",
					dateFromValueDRS1: null,
					dateToValueDRS1: null,
					dateFormatDRS1: "yyyy/MM/dd",
					chartTypes: {"defaultSelected": "timeseries_line", "values" : [{"key": "timeseries_line", "type": "Line Chart"},{"key": "timeseries_column", "type": "Bar Chart"}]}
				});
				this.setModel(oViewModel, "detailView");
				
				this.initPageSettings(this.getView());
				
				this.oToDate = new Date();
				this.oFromDate = new Date(this.oToDate.getFullYear(),0,1);
				oViewModel.setProperty("/dateFromValueDRS1", this.oFromDate);
				oViewModel.setProperty("/dateToValueDRS1",this.oToDate);
				
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
	            
				
				this.oModelChart = new JSONModel();
				
				this.getRouter().getRoute("timeAxis01").attachPatternMatched(this._onObjectMatched, this);



		},
			
		_onObjectMatched: function(oEvent){
					this.sODataId =  oEvent.getParameter("arguments").objectId;
					
					
					this.getModel().metadataLoaded().then( function() {
					
						if (this.sCoCode) {
							this.getOData();
						} else {
							this.selectCoCode();
						}	
					}.bind(this));
					
					
		},
		_dateFormat: function(oDate){
			var dd = oDate.getDate();
			var mm = oDate.getMonth() + 1;
			var yyyy = oDate.getFullYear();
			mm = mm < 10 ? '0' + mm : mm;
			dd = dd < 10 ? '0' + dd : dd;
			
			return yyyy+"/"+mm+"/" +dd;
			
		},
		_createFilter: function(sKey,sValue){
			return new sap.ui.model.Filter({
						path: sKey,
        				operator: sap.ui.model.FilterOperator.Contains,
        				value1: sValue
			});	
		},
		getOData: function(){
			var oViewModel = this.getModel("detailView");
			var oModelJson = this.oModelChart; 
			var oVizFrame = this.oVizFrame;
			var oFilters = [];
			
			oFilters.push(this._createFilter("MyCoCodeID",this.sCoCode));
			oFilters.push(this._createFilter("FromDate",this._dateFormat(this.oFromDate)));
			oFilters.push(this._createFilter("ToDate",this._dateFormat(this.oToDate)));
			
			var sObjectPath = this.getModel().createKey("DashXMainMenus", {
				DashXMainMenuID :  this.sODataId
			});
							
			oViewModel.setProperty("/busy", true);
			this.getModel().read("/" + sObjectPath + "/DashXItems", {
				method: "GET",
				filters : oFilters,
				success: function(oData) {
					
					oModelJson.setData(oData.results[0]);
					
					oVizFrame.setModel(oModelJson,"chartData");
					oViewModel.setProperty("/busy", false);
				},
				error: function() {
					
					oViewModel.setProperty("/busy", false);
				}
			});
		},
		selectCoCode: function(){
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
			var oFilter = new Filter("MyCoCodeID", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		closeCoCode: function(oEvent) {
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
				this.getOData();
			}
		},
		onCoCodeChange: function(oEvent){
			this.sCoCode = oEvent.getSource().getSelectedKey();
			var text = oEvent.getSource().getSelectedItem().getText();
			
			
			var oViewModel = this.getModel("detailView");
			oViewModel.setProperty("/title",text.substring(7,100) + " (" + this.sCoCode + ") *");
		},
		onDateRangeChange: function(oEvent){
			this.oFromDate = oEvent.getParameter("from");
			this.oToDate = oEvent.getParameter("to");
			//var bValid = oEvent.getParameter("valid");
			var oViewModel = this.getModel("detailView");
			var text = this.byId("selectCoCode").getSelectedItem().getText();
			oViewModel.setProperty("/title",text.substring(7,100) + " (" + this.sCoCode + ") *");
		},
		onRefresh: function(){
			this.getOData();
			var oViewModel = this.getModel("detailView");
			var text = this.byId("selectCoCode").getSelectedItem().getText();
			oViewModel.setProperty("/title",text.substring(7,100) + " (" + this.sCoCode + ")");
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
