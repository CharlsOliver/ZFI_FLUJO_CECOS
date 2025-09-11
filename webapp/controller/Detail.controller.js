sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "creacionflujocecos/model/formatter",
    'sap/m/MessageToast',
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function (Controller, formatter, MessageToast, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("creacionflujocecos.controller.Detail", {

        formatter: formatter,

        onInit: function () {
            this.initizializarCampos();
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("RouteDetail").attachPatternMatched(this._onObjectMatched, this);

            if (sap.ushell && sap.ushell.Container) {
                this.oUser = sap.ushell.Container.getUser();
                this.sUserId = this.oUser.getId();
            } else {
                this.sUserId = "RUVERA";
            }

            console.log("Usuario Fiori:", this.sUserId);
        },

        _onObjectMatched: function (oEvent) {
            var sCentroId = oEvent.getParameter("arguments").centro;
            this.onResetFields();
        
            if (!sCentroId) {
                this.oRouter.navTo("RouteEmpty", {}, true);
                return;
            }

            this.getView().bindElement({
				path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").centro),
				model: "Solicitudes"
			});

            this.Solicitud = this.getView().getBindingContext('Solicitudes').getObject();
			if(!this.Solicitud){
                this.Solicitud = undefined
				this.oRouter.navTo("RouteEmpty", {}, true);
			} else {
                this.onShowColumns(this.Solicitud["Id_proc"]);
                this.onLoadDetail();
                if(this.Solicitud["Id_proc"] === "0001"){
                    this.mCentro.setData(this.Solicitud["Headceco_nav"]["results"])
                } else if(this.Solicitud["Id_proc"] === "0002") {
                    this.mCentro.setData(this.Solicitud["Headcebe_nav"]["results"])
                } else if(this.Solicitud["Id_proc"] === "0003") {
                    this.mCentro.setData(this.Solicitud["Headceges_nav"]["results"])
                }

            }
        },

        initizializarCampos: function(){
            this.txtCentroCosto = "Centros de Costo";
            this.txtCentroBeneficio = "Centro de Beneficio";
            this.txtCentroGestor = "Centro Gestor";

            this.tableTitleDetail = this.getView().byId("tableTitleDetail");
            this.txtColIdCecoDetail = this.getView().byId("txtColIdCecoDetail");
            this.txtIdCecoDirDetail = this.getView().byId("txtIdCecoDirDetail");
            this.txtIdCecoCtrlDetail = this.getView().byId("txtIdCecoCtrlDetail");
            this.colIdCecoDetail = this.getView().byId("colIdCecoDetail");
            this.colDescripcionDetail = this.getView().byId("colDescripcionDetail");
            this.colUsuarioDetail = this.getView().byId("colUsuarioDetail");
            this.colResponsableDetail = this.getView().byId("colResponsableDetail");
            this.colDepartamentoDetail = this.getView().byId("colDepartamentoDetail");
            this.colSociedadDetail = this.getView().byId("colSociedadDetail");
            this.colJerarquiaDetail = this.getView().byId("colJerarquiaDetail");
            this.colClaseDetail = this.getView().byId("colClaseDetail");
            this.colFuncionalDetail = this.getView().byId("colFuncionalDetail");
            this.colMonedaDetail = this.getView().byId("colMonedaDetail");
            this.colCebeDetail = this.getView().byId("colCebeDetail");
            this.colDerivaCebeDetail = this.getView().byId("colDerivaCebeDetail");
            this.itfControlDetail = this.getView().byId("itfControlDetail");

            this.tableTitleDetail.setText(this.txtCentroCosto);
            this.txtColIdCecoDetail.setText(this.txtCentroCosto);
            this.txtIdCecoDirDetail.setText(this.txtCentroCosto);
            this.txtIdCecoCtrlDetail.setText(this.txtCentroCosto);
            this.itfControlDetail.setVisible(true);

            this.idIconTabBarDetail = this.getView().byId("idIconTabBarDetail");
            this.mCentro = this.getOwnerComponent().getModel("Centro");
            this.mDireccion = this.getOwnerComponent().getModel("Direccion");
            this.mBloqueo = this.getOwnerComponent().getModel("Bloqueo");
            this.mSolicitudes = this.getOwnerComponent().getModel("Solicitudes");

            this.ZSERV_CBG_APROV_SRV = this.getOwnerComponent().getModel("ZSERV_CBG_APROV_SRV");
            this.ZSERV_CBG_GETDATA_SRV = this.getOwnerComponent().getModel("ZSERV_CBG_GETDATA_SRV");
            this.ZSERV_CBG_GET_BLOQDIR_SRV = this.getOwnerComponent().getModel("ZSERV_CBG_GET_BLOQDIR_SRV");
        },

        onShowColumns: function (proceso) {
            // Mapeo de textos según proceso
            const textos = {
                "0001": this.txtCentroCosto,
                "0002": this.txtCentroBeneficio,
                "0003": this.txtCentroGestor
            };

            // Configuración de visibilidad por columna para cada proceso
            const columnasVisibilidad = {
                "0001": {
                    colDescripcionDetail: true,
                    colUsuarioDetail: true,
                    colResponsableDetail: true,
                    colDepartamentoDetail: true,
                    colSociedadDetail: true,
                    colJerarquiaDetail: true,
                    colClaseDetail: true,
                    colFuncionalDetail: true,
                    colMonedaDetail: true,
                    colCebeDetail: true,
                    colDerivaCebeDetail: true,
                    itfControlDetail: true
                },
                "0002": {
                    colDescripcionDetail: true,
                    colUsuarioDetail: true,
                    colResponsableDetail: true,
                    colDepartamentoDetail: true,
                    colSociedadDetail: false,
                    colJerarquiaDetail: true,
                    colClaseDetail: false,
                    colFuncionalDetail: false,
                    colMonedaDetail: false,
                    colCebeDetail: false,
                    colDerivaCebeDetail: false,
                    itfControlDetail: false
                },
                "0003": {
                    colDescripcionDetail: true,
                    colUsuarioDetail: true,
                    colResponsableDetail: true,
                    colDepartamentoDetail: false,
                    colSociedadDetail: true,
                    colJerarquiaDetail: true,
                    colClaseDetail: false,
                    colFuncionalDetail: false,
                    colMonedaDetail: false,
                    colCebeDetail: false,
                    colDerivaCebeDetail: false,
                    itfControlDetail: false
                }
            };

            // Solo proceder si el proceso está definido
            if (!textos[proceso]) return;

            // Actualizar textos
            const texto = textos[proceso];
            this.tableTitleDetail.setText(texto);
            this.txtColIdCecoDetail.setText(texto);
            this.txtIdCecoDirDetail.setText(texto);
            this.txtIdCecoCtrlDetail.setText(texto);

            // Actualizar visibilidad columnas
            const visibilidad = columnasVisibilidad[proceso];
            for (const col in visibilidad) {
                this[col].setVisible(visibilidad[col]);
            }
        },

        onNuevaSolicitud: function() {
            this.oRouter.navTo("RouteCrearSolicitud", { }, false);
        },

        onProcesarSolicitud: function(oEvent) {
            const that = this;
            const oView = this.getView();
            oView.setBusy(true);
            const sAprobada = oEvent.getSource().getCustomData()[0].getValue();
            let body = {
                User: this.sUserId,
                HeadIds_nav: [{
                    Id_proc: this.Solicitud["Id_proc"],
                    Id_flow: this.Solicitud["Id_flow"],
                    Id: this.Solicitud["Id"],
                    Aprobada: sAprobada,
                    Fecha: this.Solicitud["Fecha"],
                    Nivaut: this.Solicitud["Nivaut"]
                }]
            }

            this.ZSERV_CBG_APROV_SRV.create("/HeadSet", body, {
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                success: function (response) {
                    MessageToast.show("Solicitud procesada con éxito.");
                    oView.setBusy(false);
                    that.oRouter.navTo("RouteEmpty", {}, true);
                },
                error: function (error) {
                    console.log(error)
                    MessageToast.show("Ocurrió un error al procesar la solicitud.");
                    oView.setBusy(false);
                }
            });
        },

        onResetFields: function() {
            this.mCentro.setData([]);
            this.mDireccion.setData([]);
            this.mBloqueo.setData([]);
            this.idIconTabBarDetail.setSelectedKey("datos")
        },

        onModificarSolicitud: function (oEvent) {
            var oBindingContext = oEvent.getSource().getBindingContext("Solicitudes");
            if (!oBindingContext) {
                sap.m.MessageToast.show("No hay contexto de Solicitudes.");
                return;
            }

            var sPath = oBindingContext.getPath();

            var sPathForRoute = sPath.startsWith("/") ? sPath.slice(1) : sPath;

            this.oRouter.navTo("RouteSolicitud", {
                solicitud: sPathForRoute
            }, false);
        },

        onLoadDetail: function(){
			const that = this;
            var aFilter = [];
            aFilter.push(new Filter("Id", FilterOperator.EQ, this.Solicitud["Id"]));

			this.ZSERV_CBG_GET_BLOQDIR_SRV.read("/InputSet", {
                filters: aFilter,
				urlParameters: {
					"$expand": "Bloqueo_nav,Dir_nav",
					"format": "json"
				},
				success: function (response) {
					if(response.results.length > 0){
                        const results = response.results.map(head => {
                            const normalize = (items) => {
                                return items.map(it => {
                                    const obj = { ...it };

                                    if (obj.Cbg_id) {
                                        obj.centro = obj.Cbg_id;
                                        delete obj.Cbg_id;
                                    }
                                    if (obj.Name4) {
                                        obj.colonia = obj.Name4;
                                        delete obj.Name4;
                                    }
                                    if (obj.Stras) {
                                        obj.calle = obj.Stras;
                                        delete obj.Stras;
                                    }
                                    if (obj.Ort01) {
                                        obj.poblacion = obj.Ort01;
                                        delete obj.Ort01;
                                    }
                                    if (obj.Pstlz) {
                                        obj.codigoPostal = obj.Pstlz;
                                        delete obj.Pstlz;
                                    }
                                    if (obj.Regio) {
                                        obj.region = obj.Regio;
                                        delete obj.Regio;
                                    }
                                    if (obj.Land) {
                                        obj.pais = obj.Land;
                                        delete obj.Land;
                                    }

                                    if (obj.Ibcrp) {
                                        obj.costesPrimariosReales = obj.Ibcrp;
                                        delete obj.Ibcrp;
                                    }
                                    if (obj.Ibpcp) {
                                        obj.costesPrimariosPlanificados = obj.Ibpcp;
                                        delete obj.Ibpcp;
                                    }
                                    if (obj.Ibcrs) {
                                        obj.costesSecundariosReales = obj.Ibcrs;
                                        delete obj.Ibcrs;
                                    }
                                    if (obj.Ibpcs) {
                                        obj.costesSecundariosPlanificados = obj.Ibpcs;
                                        delete obj.Ibpcs;
                                    }
                                    if (obj.Ibci) {
                                        obj.ingresosReales = obj.Ibci;
                                        delete obj.Ibci;
                                    }
                                    if (obj.Ibpi) {
                                        obj.ingresosPlanificados = obj.Ibpi;
                                        delete obj.Ibpi;
                                    }
                                    if (obj.Ibac) {
                                        obj.comprometido = obj.Ibac;
                                        delete obj.Ibac;
                                    }

                                    return obj;
                                });
                            };

                            if (head.Dir_nav?.results) {
                                head.Dir_nav.results = normalize(head.Dir_nav.results);
                            }
                            if (head.Bloqueo_nav?.results) {
                                head.Bloqueo_nav.results = normalize(head.Bloqueo_nav.results);
                            }

                            return head;
					    });

                        that.mDireccion.setData(results[0]["Dir_nav"]?.results);
                        that.mBloqueo.setData(results[0]["Bloqueo_nav"]?.results);
                    }
				},
				error: function (error) {
					console.log(error)
				}
			});
		},
    });
});
