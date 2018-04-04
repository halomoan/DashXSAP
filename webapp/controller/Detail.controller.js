/*global location */
sap.ui.define([
		"sap/ui/dashxsap/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/dashxsap/model/formatter"
	], function (BaseController, JSONModel, formatter) {
		"use strict";

		return BaseController.extend("sap.ui.dashxsap.controller.Detail", {

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading")
				});
				
			
				this.getRouter().getRoute("home").attachPatternMatched(this._onObjectMatched, this);

				this.setModel(oViewModel, "detailView");
			},

			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */

			/**
			 * Binds the view to the object path and expands the aggregated line items.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("Materials", {
						MaterialID :  sObjectId
					});
					
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},

			/**
			 * Binds the view to the object path. Makes sure that detail view displays
			 * a busy indicator while data for the corresponding element binding is loaded.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound to the view.
			 * @private
			 */
			_bindView : function (sObjectPath) {
			
			},

			_onBindingChange : function () {
			
			}

		
		});

	}
);