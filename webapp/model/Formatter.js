sap.ui.define([
	], function () {
		"use strict";

		var Formatter = {
			currencyValue : function (sValue,sUnit) {
				if (!sValue) {
					return "";
				}
				
				if (sUnit === "UN") {
					return parseFloat(sValue).toFixed(0).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
				} else{
					return parseFloat(sValue).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
				}
			}
		};
		return Formatter;
	}, /* bExport= */ true
);