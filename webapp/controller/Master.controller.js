sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"creacionflujocecos/model/formatter"
],
function (Controller, formatter, BusyIndicator) {
    "use strict";

    return Controller.extend("creacionflujocecos.controller.Master", {

		formatter: formatter,

        onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.ZSERV_CBG_CREATEREJECT_SRV = this.getOwnerComponent().getModel("ZSERV_CBG_CREATEREJECT_SRV");
			this.mSolicitudes = this.getOwnerComponent().getModel("Solicitudes");
			this.oRouter.getRoute("RouteMaster").attachPatternMatched(this._onObjectMatched, this);
			this.oRouter.navTo("RouteEmpty", {}, true);
			this.centrosList = this.getView().byId("centrosList");
			this.onLoadSolicitudes();
        },

		_onObjectMatched: function () {
			this.onLoadSolicitudes();
			this.oRouter.navTo("RouteEmpty", {}, true);
		},

		onLoadSolicitudes: function(){
			const that = this;
			this.centrosList.setBusy(true);

			this.ZSERV_CBG_CREATEREJECT_SRV.read("/HeadSet", {
				urlParameters: {
					"$expand": "Headceco_nav,Headcebe_nav,Headceges_nav",
					"format": "json"
				},
				success: function (response) {
					const results = response.results.map(head => {
						const normalize = (items) => {
							return items.map(it => {
								const obj = { ...it };

								if (obj.Cecosto) {
									obj.Centro = obj.Cecosto;
									delete obj.Cecosto;
								}
								if (obj.Cebeneficio) {
									obj.Centro = obj.Cebeneficio;
									delete obj.Cebeneficio;
								}
								if (obj.Cegestor) {
									obj.Centro = obj.Cegestor;
									delete obj.Cegestor;
								}
								if (obj.Departamento) {
									obj.Depto = obj.Departamento;
									delete obj.Departamento;
								}

								return obj;
							});
						};

						if (head.Headceco_nav?.results) {
							head.Headceco_nav.results = normalize(head.Headceco_nav.results);
						}
						if (head.Headcebe_nav?.results) {
							head.Headcebe_nav.results = normalize(head.Headcebe_nav.results);
						}
						if (head.Headceges_nav?.results) {
							head.Headceges_nav.results = normalize(head.Headceges_nav.results);
						}

						return head;
					});

					that.mSolicitudes.setData(results);
					that.centrosList.setBusy(false);
				},
				error: function (error) {
					console.log(error)
				}
			});
		},

		onItemPress: function (oEvent) {
			var oListItem = oEvent.getParameter("listItem");
		
			if (!oListItem) {
				console.error("No se encontró un item válido en la lista.");
				return;
			}
		
			var oBindingContext = oListItem.getBindingContext("Solicitudes");
		
			if (!oBindingContext) {
				console.error("No se encontró el contexto de datos en el item.");
				return;
			}
		
			var sPath = oBindingContext.getPath();
			var sId = sPath.split("/").pop();
			this.oRouter.navTo("RouteDetail", {
				centro: sId
			}, true);
		}
    });
});
