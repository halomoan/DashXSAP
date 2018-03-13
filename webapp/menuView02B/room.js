sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";

	var roomView = BlockBase.extend("sap.ui.dashxsap.menuView02B.room", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "sap.ui.dashxsap.view.entityRoom01",
					type: "XML"
				},
				Expanded: {
					viewName: "sap.ui.dashxsap.view.entityRoom01",
					type: "XML"
				}
			}
		}

	});
	return roomView;
}, true);