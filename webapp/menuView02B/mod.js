sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";

	var modView = BlockBase.extend("sap.ui.dashxsap.menuView02B.mod", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "sap.ui.dashxsap.view.entityMOD01",
					type: "XML"
				},
				Expanded: {
					viewName: "sap.ui.dashxsap.view.entityMOD01",
					type: "XML"
				}
			}
		}

	});
	return modView;
}, true);