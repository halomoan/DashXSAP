sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";

	var overView = BlockBase.extend("sap.ui.dashxsap.menuView02B.overview", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "sap.ui.dashxsap.view.entityOverview01",
					type: "XML"
				},
				Expanded: {
					viewName: "sap.ui.dashxsap.view.entityOverview01",
					type: "XML"
				}
			}
		}

	});
	return overView;
}, true);