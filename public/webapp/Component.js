sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/ui/model/BindingMode",
    "sap/ui/model/json/JSONModel"
], function(UIComponent, Device, BindingMode, JSONModel) {
    "use strict";

    return UIComponent.extend("com.mlauffer.gotmoneyappui5.Component", {
        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */
        init: function() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            this.setModels();

            // create the views based on the url/hash
            this.getRouter().initialize();
        },


        /**
         * The component is destroyed by UI5 automatically.
         * @public
         * @override
         */
        destroy: function() {
            // call the base component's destroy function
            UIComponent.prototype.destroy.apply(this, arguments);
        },


        setModels : function() {
            var oData = {
                User: {
                    Account: [],
                    Category: [],
                    Transaction: []
                }
            };
            var oModel = this.getModel();
            oModel.setDefaultBindingMode(BindingMode.OneWay);
            oModel.iSizeLimit = 1000;
            oModel.setData(oData);

            // Account Types Model
            oModel = new JSONModel();
            oModel.setDefaultBindingMode(BindingMode.OneWay);
            //var url = "../../../accounttyperest/";
            //oModel.loadData(url, {}, true, "GET", false, true);
            this.setModel(oModel, "accTypes");

            // set the device model
            oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode(BindingMode.OneWay);
            this.setModel(oModel, "device");
        }
    });
});