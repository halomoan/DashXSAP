sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/format/ChartFormatter",
    "sap/viz/ui5/api/env/Format",
    "sap/viz/ui5/controls/common/feeds/FeedItem"
], function(Controller,JSONModel,ChartFormatter,Format,FeedItem) {
	"use strict";
	
	jQuery.sap.declare("sap.ui.dashxsap.controller.barchart");
	return Controller.extend("sap.ui.dashxsap.controller.barchart", {
		
		sChartType : "barchart",
	
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
           
            	var oVizFrame = this.oVizFrame = sap.ui.core.Fragment.byId(this.sChartType,"idVizFrame");
	            var oPopOver = sap.ui.core.Fragment.byId(this.sChartType,"idPopOver");
            	oPopOver.connect(oVizFrame.getVizUid());
            	oPopOver.setFormatString(ChartFormatter.DefaultPattern.STANDARDFLOAT);
            	
            	
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
                var vizframe = sap.ui.core.Fragment.byId(this.sChartType,"idVizFrame");
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
                sap.ui.core.Fragment.byId(this.sChartType,"chartFixFlex").setFlexContent(oChartContainer);
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
				
					oVizFrame.removeAllFeeds();
					
				
					var feedValueAxis = new FeedItem({
                    	"uid" : "valueAxis",
                    	"type" : "Measure",
                    	"values": oModelJson.getProperty("/legend")
                	});
                	
                	var feedCategoryAxis = new FeedItem({
                    	"uid": "categoryAxis",
                    	"type": "Dimension",
                    	"values": ["entity"]
                	});
                	oVizFrame.addFeed(feedValueAxis);
                	oVizFrame.addFeed(feedCategoryAxis);
					
					oVizFrame.setVizProperties({
		                title: {
		                    visible: true,
		                    text : oModelJson.getProperty("/title")
		                },
		                plotArea: {
	                    	dataLabel: {
	                        	formatString: ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
	                        	visible: true
	                    	}
		                },
		                valueAxis: {
	                    	label: {
	                        	formatString: ChartFormatter.DefaultPattern.SHORTFLOAT
	                    	},
	                    	title: {
	                        	visible: false
	                    	}
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
		}
	});
});