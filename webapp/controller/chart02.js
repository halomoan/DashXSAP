sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/format/ChartFormatter",
    "sap/viz/ui5/api/env/Format"
], function(Controller,JSONModel,ChartFormatter,Format) {
	"use strict";
	
	jQuery.sap.declare("sap.ui.dashxsap.controller.chart02");
	return Controller.extend("sap.ui.dashxsap.controller.chart02", {
		
		sChartType : "chart01",
		settingsModel : {
            dataset : {
                name: "Dataset",
                defaultSelected : 1,
                values : [{
                    name : "Small",
                    value : "/small.json"
                },{
                    name : "Medium",
                    value : "/medium.json"
                },{
                    name : "Large",
                    value : "/large.json"
                }]
            },
            series : {
                name : "Series",
                defaultSelected : 0,
                values : [{
                    name : "1 Series",
                    value : ["KF1"]
                }, {
                    name : '2 Series',
                    value : ["KF1", "KF2"]
                }]
            },
            dataLabel : {
                name : "Value Label",
                defaultState : true
            },
            axisTitle : {
                name : "Axis Title",
                defaultState : false
            }
        },
        
        oVizFrame : null,
        _createFilter: function(sKey,sValue){
			return new sap.ui.model.Filter({
						path: sKey,
        				operator: sap.ui.model.FilterOperator.Contains,
        				value1: sValue
			});	
		},
		onInit: function(oThis) {
				var oViewModel = new JSONModel({
						busy : false,
						delay : 0
				});
				
				this.oParent = oThis;
				this.oParent.setModel(oViewModel, this.sViewModel);
				
				Format.numericFormatter(ChartFormatter.getInstance());
            	var formatPattern = ChartFormatter.DefaultPattern;
            	
            	var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
				oVizFrame.setVizProperties({
                plotArea: {
                    dataLabel: {
                        formatString: formatPattern.SHORTFLOAT_MFD2,
                        visible: true
                    }
                },
                valueAxis: {
                    label: {
                        formatString: formatPattern.SHORTFLOAT
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
                    visible: false,
                    text: 'Revenue by City and Store Name'
                }
            });
		},
		callMe: function(){
			alert("Aneh");	
		},
		refreshData: function(oParams){
			
		}
	});
});