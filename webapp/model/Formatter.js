sap.ui.define([
	], function () {
		"use strict";

		var Formatter = {
			currencyValue : function (sValue,sUnit) {
				
				if (!sValue) {
					return "";
				}
				
				if (sUnit === "UN") {
					return sValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				} else{
					return parseFloat(sValue).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
				}
			},
			formatDate : function (date) {
			  var monthNames = [
			    "Jan", "Feb", "Mar",
			    "Apr", "May", "Jun", "Jul",
			    "Aug", "Sept", "Oct",
			    "Nov", "Dec"
			  ];
			
			  var day = date.getDate();
			  var monthIndex = date.getMonth();
			  var year = date.getFullYear();
			
			  return monthNames[monthIndex] + " " + day + ", " + year;
			}
		};
		return Formatter;
	}, /* bExport= */ true
);