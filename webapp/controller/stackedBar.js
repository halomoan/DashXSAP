sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/format/ChartFormatter",
    "sap/viz/ui5/api/env/Format"
], function(Controller,JSONModel,ChartFormatter,Format) {
	"use strict";
	
	jQuery.sap.declare("sap.ui.dashxsap.controller.stackedBar");
	return Controller.extend("sap.ui.dashxsap.controller.stackedBar", {
		
		sChartType : "stackedBar",
		chartSettings : 
				{
	               
		            plotArea: {
	                    dataLabel: {
	                        formatString: ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
	                        visible: true,
	                        showTotal: false
	                	}
	                },
	                valueAxis: {
	                    label: {
	                        formatString: ChartFormatter.DefaultPattern.SHORTFLOAT
	                    },
	                    title: {
	                        visible: false
	                    }
	                },
	                valueAxis2: {
	                    label: {
	                        formatString: ChartFormatter.DefaultPattern.SHORTFLOAT
	                    },
	                    title: {
	                        visible: false
	                    }
	                },
	                categoryAxis: {
	                    title: {
	                        visible: false
	                    }
	                },
	                title: {
	                    visible: false
	                }
	    }, 
        oVizFrame : null,
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
						delay : 0,
						type : {
			                name : "Stacked Type",
			                values : [{
			                    name : "Regular",
			                    vizType : "stacked_bar",
			                    vizProperties : {
			                        plotArea: {
			                            dataLabel: {
			                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2
			                            }
			                        },
			                        valueAxis: {
			                            label: {
			                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
			                            }
			                        },
			                        valueAxis2: {
			                            label: {
			                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
			                            }
			                        }
			                    }
			                },{
			                    name : "100%",
			                    vizType : "100_stacked_bar",
			                    vizProperties : {
			                        plotArea: {
			                            mode: "percentage",
			                            dataLabel: {
			                                type: "percentage",
			                                formatString:ChartFormatter.DefaultPattern.STANDARDPERCENT_MFD2
			                            }
			                        },
			                        valueAxis: {
			                            label: {
			                                formatString:null
			                            }
			                        },
			                        valueAxis2: {
			                            label: {
			                                formatString:null
			                            }
			                        }
			                    }
			                }]
			            }
				});
				
				this.oParent = oThis;
				this.sChartType = sId;
				this.oParent.setModel(oViewModel, this.sChartType + "View");
				
				Format.numericFormatter(ChartFormatter.getInstance());
        	
        		 
            	var oVizFrame = this.oVizFrame = sap.ui.core.Fragment.byId(this.sChartType,"idVizFramestackedBar");
            	
           
            	
            	
            	oVizFrame.setVizProperties(this.chartSettings);
	            var oPopOver = sap.ui.core.Fragment.byId(this.sChartType,"idPopOverstackedBar");
            	oPopOver.connect(oVizFrame.getVizUid());
            	oPopOver.setFormatString(ChartFormatter.DefaultPattern.STANDARDFLOAT);
            	
            	/*var oTooltip = new sap.viz.ui5.controls.VizTooltip({});
            	oTooltip.connect(oVizFrame.getVizUid());
            	oTooltip.setFormatString(ChartFormatter.DefaultPattern.STANDARDFLOAT);
            	*/
            	
            	this.initChartSettings();
		},
		initChartSettings : function() {
            
            // try to load sap.suite.ui.commons for using ChartContainer
            // sap.suite.ui.commons is available in sapui5-sdk-dist but not in demokit
            var bSuiteAvailable = jQuery.sap.sjax({
                type : "HEAD",
                url : sap.ui.resource("sap.suite.ui.commons", "library.js")
            }).success;
            if (bSuiteAvailable) {
                sap.ui.getCore().loadLibrary("sap.suite.ui.commons");
                var vizframe = sap.ui.core.Fragment.byId(this.sChartType,"idVizFramestackedBar");
                var oChartContainerContent = new sap.suite.ui.commons.ChartContainerContent({
                    icon : "sap-icon://horizontal-stacked-chart",
                    title : "vizFrame Stacked bar Chart Sample",
                    content : [ vizframe ]
                });
                
                
                var sView = this.sChartType + "View";
                var oThis = this;
                
                var oSelect = new sap.m.Select({
                	id:"sel",
                	items: {
                		path : sView + ">/type/values",
	                	template: new sap.ui.core.Item({
	                    	key: { path: sView + ">name" }, text: { path: sView + ">name" }
	                    })
                    },
                    selectedKey: "Regular",
                	forceSelection: false,
                	change : function(oEvent) {
						//var selectedKey = oEvent.getSource().getSelectedItem().getKey();
						var oType = oEvent.getSource().getSelectedItem().getBindingContext(sView);
						
            			if(oThis.oVizFrame && oType){
            				var bindValue = oType.getObject();
            				oThis.oVizFrame.setVizType(bindValue.vizType);
                			oThis.oVizFrame.setVizProperties(bindValue.vizProperties);
            			}
                    }
					
            	});
            
            	var oChartContainer = new sap.suite.ui.commons.ChartContainer({
                    content : [ oChartContainerContent ],
                    dimensionSelectors : [ oSelect ]
                });
                
                oChartContainer.setShowFullScreen(true);
                oChartContainer.setAutoAdjustHeight(true);
                sap.ui.core.Fragment.byId(this.sChartType,"chartFixFlexstackedBar").setFlexContent(oChartContainer);
            }
        },
		refreshData: function(oParams){
			var oViewModel = this.oParent.getModel(this.sChartType + "View");
			var oModelJson = new JSONModel();
			var oVizFrame = this.oVizFrame;
			var oThis = this;
			
			oViewModel.setProperty("/busy", true);
			
			oModelJson.attachRequestCompleted(function() {
					
					
					oVizFrame.setModel(oModelJson,oThis.sChartType + "Data");
					oVizFrame.setVizProperties({
		                title: {
		                    visible: true,
		                    text : oModelJson.getProperty("/title")
		                }
		            });
					oViewModel.setProperty("/busy", false);
			});
				
			oModelJson.attachRequestFailed(function() {
					alert("Failed to contact SAP BW Server!");
					oViewModel.setProperty("/busy", false);
					
			});
			
			
			var parameters = {
					"MNU": oParams.srcId,
					"qe": oParams.Region,
					"qd" : oParams.Date,
					"qitem" : oParams.ItemId,
					"qfig" : oParams.KF          
			};
			
			oModelJson.loadData(window.rest_url,parameters,true, "GET", false, false);
		},
		dataSort: function(dataset) {
            //let data sorted by revenue
            if (dataset && dataset.hasOwnProperty("DataSet")) {
                var arr = dataset.DataSet;
                arr = arr.sort(function (a, b) {
                    return b.KF1 - a.KF1;
                });
            }
        }
	});
});