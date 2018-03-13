sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";

	var rbeView = BlockBase.extend("sap.ui.dashxsap.menuView02B.rbe", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "sap.ui.dashxsap.view.entityRBE01",
					type: "XML"
				},
				Expanded: {
					viewName: "sap.ui.dashxsap.view.entityRBE01",
					type: "XML"
				}
			}
		}

	});
	return rbeView;
}, true);