sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/format/ChartFormatter",
    "sap/viz/ui5/api/env/Format"
], function(Controller,JSONModel,ChartFormatter,Format) {
	"use strict";
	
	jQuery.sap.declare("sap.ui.dashxsap.controller.donut");
	return Controller.extend("sap.ui.dashxsap.controller.donut", {
		
		sChartType : "chart",
		chartSettings : {
	               
		            dataLabel : {
		                name : "Value Label",
		                defaultState : false,
		                visible: true
		            },
		            title: {
                    	visible: true
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
						delay : 0
				});
				
				this.oParent = oThis;
				this.sChartType = sId;
				this.oParent.setModel(oViewModel, this.sChartType + "View");
				
				Format.numericFormatter(ChartFormatter.getInstance());
           
            	var oVizFrame = this.oVizFrame = sap.ui.core.Fragment.byId(this.sChartType,"idVizFramedonut");
            	oVizFrame.setVizProperties(this.chartSettings);
	            var oPopOver = sap.ui.core.Fragment.byId(this.sChartType,"idPopOverdonut");
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
                var vizframe = sap.ui.core.Fragment.byId(this.sChartType,"idVizFramedonut");
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
                sap.ui.core.Fragment.byId(this.sChartType,"chartFixFlexdonut").setFlexContent(oChartContainer);
            }
        },
		refreshData: function(oData){
			
			
			if(oData.rbedonut) {
				
				var oModelJson = new JSONModel();
				var oVizFrame = this.oVizFrame;
				oModelJson.setData(oData.rbedonut);
				oVizFrame.setModel(oModelJson,this.sChartType + "Data");
				oVizFrame.setVizProperties({
		                title: {
		                    visible: true,
		                    text : oModelJson.getProperty("/title")
		                }
		            });
			}
			
			/*var oViewModel = this.oParent.getModel(this.sChartType + "View");
			var oModelJson = new JSONModel();
			var oVizFrame = this.oVizFrame;
			var oThis = this;
			var filters = [];
			filters.push(this._createFilter("Region",oParams.Region));
			filters.push(this._createFilter("ChartType",this.sChartType));
			
		
            		
			oViewModel.setProperty("/busy", true);
			this.oParent.getModel().read("/" + oParams.ODataKey + "/DashXItems", {
				method: "GET",
				filters : filters,
				success: function(oData) {
			
					oThis.dataSort(oData.results[0]);
					oModelJson.setData(oData.results[0]);
					
					oVizFrame.setModel(oModelJson,oThis.sChartType + "Data");
					
					oVizFrame.setVizProperties({
		                title: {
		                    visible: true,
		                    text : oModelJson.getProperty("/Title")
		                }
		            });
					oViewModel.setProperty("/busy", false);
				},
				error: function() {
					
					oViewModel.setProperty("/busy", false);
				}
			});*/
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