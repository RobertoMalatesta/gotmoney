sap.ui.define([
  'jquery.sap.global',
  'sap/m/MessageBox',
  'sap/m/MessageToast',
  'sap/ui/model/json/JSONModel',
  'sap/ui/core/ValueState',
  'com/mlauffer/gotmoneyappui5/controller/BaseController',
  'com/mlauffer/gotmoneyappui5/controller/FacebookLogin',
  'com/mlauffer/gotmoneyappui5/controller/GoogleLogin',
  'com/mlauffer/gotmoneyappui5/controller/Validator',
  'com/mlauffer/gotmoneyappui5/controller/ZString',
  'com/mlauffer/gotmoneyappui5/model/ObjectFactory',
  'com/mlauffer/gotmoneyappui5/model/formatter'
], function(jQuery, MessageBox, MessageToast, JSONModel, ValueState, BaseController, FacebookLogin, GoogleLogin,
    Validator, ZString, ObjectFactory, formatter) {
  'use strict';

  return BaseController.extend('com.mlauffer.gotmoneyappui5.controller.Signup', {
    formatter: formatter,
    ZString: ZString,

    onInit: function() {
      try {
        var that = this;
        this.getView().setModel(new JSONModel(), 'user');
        this.getRouter().getRoute('signup').attachMatched(this._onRouteMatchedNew, this);

        this.getView().addEventDelegate({
          onAfterShow: function() {
            var oGoogleLogin = new GoogleLogin();
            oGoogleLogin.renderButton(that, that.getView().byId('btGoogle').getDomRef().id);
          }
        }, this);

      } catch (e) {
        this.saveLog('E', e.message);
        MessageBox.error(e.message);
      }
    },


    onSave: function(oEvent) {
      this.vibrate();
      var oView = this.getView();
      // Create new validator instance
      var oValidator = new Validator();

      // Validate input fields
      oValidator.validate(oView.byId('form'));
      if (!oValidator.isValid()) {
        return;
      }

      if (oView.byId('pwd').getValue()) {
        if (oView.byId('pwd').getValue() === oView.byId('pwdRepeat').getValue()) {
          oView.byId('pwd').setValueState(ValueState.None);
          oView.byId('pwdRepeat').setValueState(ValueState.None);
        } else {
          oView.byId('pwd').setValueState(ValueState.Error);
          oView.byId('pwdRepeat').setValueState(ValueState.Error);
          MessageToast.show(this.getResourceBundle().getText('Error.passwordNotEqual'));
          return;
        }
      }

      this.getView().setBusy(true);
      if (this.getView().getViewName() === 'com.mlauffer.gotmoneyappui5.view.User') {
        this._saveEdit(oEvent);
      } else {
        this._saveNew(oEvent);
      }
    },

    onFacebookLogin: function() {
      var oFacebookLogin = new FacebookLogin();
      oFacebookLogin.login(this);
    },


    _onRouteMatched: function() {
      var sObjectPath = '/User/';
      this._bindView(sObjectPath);
    },


    _onRouteMatchedNew: function() {
      this.getView().getModel('user').setData(ObjectFactory.buildUser());
    },


    _bindView: function(sPath) {
      var oView = this.getView();
      oView.unbindElement();
      oView.bindElement({
        path: sPath,
        events: {
          change: this._onBindingChange.bind(this),
          dataRequested: function(oEvent) {
            oView.setBusy(true);
          },
          dataReceived: function(oEvent) {
            oView.setBusy(false);
          }
        }
      });
    },


    _onBindingChange: function() {
      // No data for the binding
      if (!this.getView().getBindingContext()) {
        this.getRouter().getTargets().display('notFound');
      }
    },


    _loginDone: function() {
      this.setUserLogged(true);
      this._loadBackendData();
      this.getOwnerComponent().byId('rootApp').getController()._toogleButtonsVisible();
      this.getView().setBusy(false);
      this.getRouter().navTo('home');
      MessageToast.show(this.getResourceBundle().getText('Success.login'));
    },


    _saveNew: function() {
      var that = this;
      var mPayload = this._getPayload();
      mPayload.iduser = jQuery.now();

      jQuery.ajax({
        url: '/api/session/signup',
        data: JSON.stringify(mPayload),
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        }
      })
        .done(function() {
          that._newDone(mPayload);
        })
        .fail(jQuery.proxy(that._ajaxFail, this));
    },


    _newDone: function(mPayload) {
      try {
        this.getView().getModel().getData().User = mPayload;
        //this.onFinishBackendOperation();
        this._loginDone();
        //MessageToast.show(this.getResourceBundle().getText("Success.save"));
        this.getView().setBusy(false);

      } catch (e) {
        this.saveLog('E', e.message);
        MessageBox.error(e.message);
        this.getView().setBusy(false);
      }
    },


    _getPayload: function() {
      var oView = this.getView();
      var mPayload = ObjectFactory.buildUser();

      //iduser : null,
      mPayload.email = oView.byId('email').getValue();
      mPayload.passwd = oView.byId('pwd').getValue();
      mPayload.passwdconf = oView.byId('pwdRepeat').getValue();
      mPayload.name = oView.byId('name').getValue();
      mPayload.gender = oView.byId('sex').getSelectedKey();
      mPayload.birthdate = oView.byId('birthdate').getDateValue();
      mPayload.alert = oView.byId('alert').getState();
      mPayload.tec = oView.byId('terms').getSelected();
      mPayload.captcha = oView.byId('captcha').getValue();
      mPayload.lastchange = jQuery.now();
      //mPayload.lastsync : null
      if (mPayload.birthdate) {
        mPayload.birthdate.setHours(12); //Workaround for date location, avoid D -1
      }
      return mPayload;
    }
  });
});
