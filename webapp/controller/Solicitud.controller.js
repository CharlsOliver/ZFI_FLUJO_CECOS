sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "creacionflujocecos/model/formatter",
    'sap/ui/core/BusyIndicator'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, MessageToast, Filter, FilterOperator, MessageBox, formatter, BusyIndicator) {
        "use strict";

        let tipoCargaExcel = "cecos"
        let action = "crear"
        let modification = false;

        return Controller.extend("creacionflujocecos.controller.Solicitud", {

            formatter: formatter,

            onInit: function () {
                this.txtCentroCosto = "Centros de Costo";
                this.txtCentroBeneficio = "Centro de Beneficio";
                this.txtCentroGestor = "Centro Gestor";

                this.tableTitle = this.getView().byId("tableTitle");
                this.txtColIdCeco = this.getView().byId("txtColIdCeco");
                this.txtIdCecoDir = this.getView().byId("txtIdCecoDir");
                this.txtIdCecoCtrl = this.getView().byId("txtIdCecoCtrl");
                this.colIdCeco = this.getView().byId("colIdCeco");
                this.colDescripcion = this.getView().byId("colDescripcion");
                this.colUsuario = this.getView().byId("colUsuario");
                this.colResponsable = this.getView().byId("colResponsable");
                this.colDepartamento = this.getView().byId("colDepartamento");
                this.colSociedad = this.getView().byId("colSociedad");
                this.colJerarquia = this.getView().byId("colJerarquia");
                this.colClase = this.getView().byId("colClase");
                this.colFuncional = this.getView().byId("colFuncional");
                this.colMoneda = this.getView().byId("colMoneda");
                this.colCebe = this.getView().byId("colCebe");
                this.inptSolicitante = this.getView().byId("inptSolicitante");
                this.colDerivaCebe = this.getView().byId("colDerivaCebe");
                this.itfControl = this.getView().byId("itfControl");
                this.slctProceso = this.getView().byId("slctProceso");
                this.inptConsecutivo = this.getView().byId("inptConsecutivo");
                this.slctFlujo = this.getView().byId("slctFlujo");
                this.tableCentros = this.getView().byId("tableCentros");
                this.tableBloqueos = this.getView().byId("tableBloqueos");
                this.tableDirecciones = this.getView().byId("tableDirecciones");
                this.idIconTabBar = this.getView().byId("idIconTabBar");

                this.ZSERV_CBG_SHELP_SRV = this.getOwnerComponent().getModel("ZSERV_CBG_SHELP_SRV");
                this.ZSERV_CBG_CREATE_SRV = this.getOwnerComponent().getModel("ZSERV_CBG_CREATE_SRV");
                this.ZSERV_CBG_GET_BLOQDIR_SRV = this.getOwnerComponent().getModel("ZSERV_CBG_GET_BLOQDIR_SRV");

                this.mProceso = this.getOwnerComponent().getModel("Proceso");
                this.mConsecutivo = this.getOwnerComponent().getModel("Consecutivo");
                this.mFlujo = this.getOwnerComponent().getModel("Flujo");
                this.mCentro = this.getOwnerComponent().getModel("Centro");
                this.mDireccion = this.getOwnerComponent().getModel("Direccion");
                this.mBloqueo = this.getOwnerComponent().getModel("Bloqueo");
                this.mUsuario = this.getOwnerComponent().getModel("Usuario");
                this.mClase = this.getOwnerComponent().getModel("Clase");
                this.mAreaJerarquica = this.getOwnerComponent().getModel("AreaJerarquica");
                this.mSociedad = this.getOwnerComponent().getModel("Sociedad");
                this.mDivision = this.getOwnerComponent().getModel("Division");
                this.mAreaFuncional = this.getOwnerComponent().getModel("AreaFuncional");
                this.mMoneda = this.getOwnerComponent().getModel("Moneda");
                this.mCentroBeneficio = this.getOwnerComponent().getModel("CentroBeneficio");
                this.mDepartamento = this.getOwnerComponent().getModel("Departamento");
                this.mRegion = this.getOwnerComponent().getModel("Region");
                this.mPais = this.getOwnerComponent().getModel("Pais");

                this.onResetFields();
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RouteCrearSolicitud").attachPatternMatched(this._onObjectMatchedCreate, this);
                this.oRouter.getRoute("RouteSolicitud").attachPatternMatched(this._onObjectMatched, this);

                if (sap.ushell && sap.ushell.Container) {
                    this.oUser = sap.ushell.Container.getUser();
                    this.sUserId = this.oUser.getId();
                    this.inptSolicitante.setValue(this.oUser.getFullName());
                    //this.sUserId = "RUVERA";
                    //this.inptSolicitante.setValue("RUVEN VERA");
                } else {
                    this.sUserId = "RUVERA";
                    this.inptSolicitante.setValue("Default User");
                }
                console.log("Usuario Fiori:", this.sUserId);
            },

            _onObjectMatchedCreate: function () {
                this.onResetFields();
                this.tableTitle.setText(this.txtCentroCosto);
                this.txtColIdCeco.setText(this.txtCentroCosto);
                this.txtIdCecoDir.setText(this.txtCentroCosto);
                this.txtIdCecoCtrl.setText(this.txtCentroCosto);
                this.slctProceso.setEnabled(true);
                this.itfControl.setVisible(true);
                tipoCargaExcel = "cecos"
                modification = false
                this.onShowColumns("0001");
                this.onLoadMatchcodes("0001");
            },

            _onObjectMatched: function (oEvent) {
                this.onResetFields();
                modification = true;
                var sSolicitudId = oEvent.getParameter("arguments").solicitud;

                if (!sSolicitudId) {
                    this.oRouter.navTo("RouteEmpty", {}, true);
                    return;
                }

                this.getView().bindElement({
                    path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").solicitud),
                    model: "Solicitudes"
                });

                this.Solicitud = this.getView().getBindingContext('Solicitudes').getObject();
                if (!this.Solicitud) {
                    this.Solicitud = undefined
                    this.mCentro.setData([])
                    this.oRouter.navTo("RouteEmpty", {}, true);
                } else {
                    modification = true;
                    this.onLoadMatchcodes(this.Solicitud["Id_proc"]);
                    this.onLoadDetail();
                    this.onShowColumns(this.Solicitud["Id_proc"]);
                }
            },

            onLoadMatchcodes: function (proceso) {
                BusyIndicator.show();
                const that = this;
                let aPromesas = [];

                for (var i = 1; i <= 16; i++) {
                    // Saltar si es 2, o si es 3 y modification = true
                    if (i === 2 || (i === 3 && modification)) {
                        continue;
                    }
                    const aFilter = [];
                    aFilter.push(new Filter("Campo", FilterOperator.EQ, i.toString()));
                    if (i === 3) {
                        aFilter.push(new Filter("Id", FilterOperator.EQ, proceso));
                    }
                    aPromesas.push(new Promise((resolve, reject) => {
                        this.ZSERV_CBG_SHELP_SRV.read("/InputSet", {
                            filters: aFilter,
                            success: function (oData) {
                                resolve(oData.results);
                            },
                            error: function (oError) {
                                reject(oError);
                            }
                        });
                    }));
                }

                Promise.all(aPromesas).then((aResultados) => {
                    const aAllResponse = aResultados.flat();
                    const procesos = aAllResponse.filter(item => item.Campo === "1");
                    const flujos = aAllResponse.filter(item => item.Campo === "4");
                    const usuarios = aAllResponse.filter(item => item.Campo === "5");
                    const clases = aAllResponse.filter(item => item.Campo === "6");
                    const areas_jerarquicas = aAllResponse.filter(item => item.Campo === "7");
                    const sociedades = aAllResponse.filter(item => item.Campo === "8");
                    const divisiones = aAllResponse.filter(item => item.Campo === "9");
                    const areas_funcionales = aAllResponse.filter(item => item.Campo === "10");
                    const monedas = aAllResponse.filter(item => item.Campo === "11");
                    const centros_beneficio = aAllResponse.filter(item => item.Campo === "12");
                    const regiones = aAllResponse.filter(item => item.Campo === "13");
                    const paises = aAllResponse.filter(item => item.Campo === "14");

                    if (!modification) {
                        const consecutivos = aAllResponse.filter(item => item.Campo === "3");
                        that.inptConsecutivo.setValue(consecutivos[0]["Valor"]);
                    }

                    that.mProceso.setData(procesos);
                    that.mFlujo.setData(flujos);
                    that.mUsuario.setData(usuarios);
                    that.mClase.setData(clases);
                    that.mAreaJerarquica.setData(areas_jerarquicas);
                    that.mSociedad.setData(sociedades);
                    that.mDivision.setData(divisiones);
                    that.mAreaFuncional.setData(areas_funcionales);
                    that.mMoneda.setData(monedas);
                    that.mCentroBeneficio.setData(centros_beneficio);
                    that.mRegion.setData(regiones);
                    that.mPais.setData(paises);

                    if (modification) {
                        that.slctProceso.setEnabled(false);
                        that.slctProceso.setSelectedKey(that.Solicitud["Id_proc"]);
                        that.slctFlujo.setSelectedKey(that.Solicitud["Id_flow"]);
                        that.inptConsecutivo.setValue(that.Solicitud["Id"]);
                        that.mCentro.setData(that.Solicitud["Headceco_nav"]["results"].map(item => {
                            return {
                                centro: item.Centro,
                                denominacion: item.Descripcion,
                                usuario: item.Usuario,
                                responsable: item.Responsable,
                                departamento: item.Depto,
                                sociedad: item.Sociedad,
                                areaJerarquia: item.AreaJerar,
                                claseCeCo: item.Clasececo,
                                areaFuncional: item.AreaFunc,
                                moneda: item.Moneda,
                                cEBE: item.Cebe,
                                derivarACeGe: item.Derivarcege
                            };
                        }));
                    }

                    BusyIndicator.hide();
                }).catch((err) => {
                    MessageToast.show("Error al obtener información.")
                    console.error("Error al consultar el OData:", err);
                    BusyIndicator.hide();
                });
            },

            onNavBack: function () {
                this.oRouter.navTo("RouteMaster", {}, true);
            },

            onProcesoChanged: function (oEvent) {
                const proceso = oEvent.getParameter("selectedItem").getKey();
                if (this.mCentro.getData().length > 0) {
                    MessageToast.show("Tablas eliminadas por cambio de proceso.");
                }
                this.mCentro.setData([]);
                this.mDireccion.setData([]);
                this.mBloqueo.setData([]);
                this.onLoadMatchcodes(proceso);
                this.onShowColumns(proceso);
            },

            onShowColumns: function (proceso) {
                // Alias de procesos nuevos → procesos base
                const alias = {
                    "0004": "0001",
                    "0005": "0002",
                    "0006": "0003"
                };

                // Normaliza el proceso a su base
                const procesoBase = alias[proceso] || proceso;

                // Textos por proceso base
                const textos = {
                    "0001": this.txtCentroCosto,
                    "0002": this.txtCentroBeneficio,
                    "0003": this.txtCentroGestor
                };

                // Visibilidad por proceso base
                const columnasVisibilidad = {
                    "0001": {
                        colDescripcion: true,
                        colUsuario: true,
                        colResponsable: true,
                        colDepartamento: true,
                        colSociedad: true,
                        colJerarquia: true,
                        colClase: true,
                        colFuncional: true,
                        colMoneda: true,
                        colCebe: true,
                        colDerivaCebe: true,
                        itfControl: true
                    },
                    "0002": {
                        colDescripcion: true,
                        colUsuario: true,
                        colResponsable: true,
                        colDepartamento: true,
                        colSociedad: false,
                        colJerarquia: true,
                        colClase: false,
                        colFuncional: false,
                        colMoneda: false,
                        colCebe: false,
                        colDerivaCebe: false,
                        itfControl: false
                    },
                    "0003": {
                        colDescripcion: true,
                        colUsuario: true,
                        colResponsable: true,
                        colDepartamento: false,
                        colSociedad: true,
                        colJerarquia: true,
                        colClase: false,
                        colFuncional: false,
                        colMoneda: false,
                        colCebe: false,
                        colDerivaCebe: false,
                        itfControl: false
                    }
                };

                // Si el proceso no es válido, sal
                if (!textos[procesoBase] || !columnasVisibilidad[procesoBase]) {
                    return;
                }

                // Actualizar textos
                const texto = textos[procesoBase];
                this.tableTitle.setText(texto);
                this.txtColIdCeco.setText(texto);
                this.txtIdCecoDir.setText(texto);
                this.txtIdCecoCtrl.setText(texto);

                // Actualizar visibilidad de columnas (con verificación defensiva)
                const visibilidad = columnasVisibilidad[procesoBase];
                for (const col in visibilidad) {
                    if (Object.prototype.hasOwnProperty.call(visibilidad, col) && this[col]) {
                        this[col].setVisible(visibilidad[col]);
                    }
                }
            },

            onOpenAgregarRegistro: function (oEvent) {
                action = oEvent.getSource().getCustomData()[0].getValue();
                let oContextData = null;
                if (action === "editar") {
                    const oItem = oEvent.getSource().getParent();
                    const oContext = oItem.getBindingContext("Centro");
                    if (oContext) {
                        oContextData = oContext.getObject();
                        this._itemEnEdicion = oContextData; // Guarda si necesitas usar después
                    }
                }

                if (!this._oDialogAgregarRegistro) {
                    Fragment.load({
                        id: this.getView().createId("dAgregarRegistro"),
                        name: "creacionflujocecos.view.fragment.AgregarRegistro",
                        controller: this
                    }).then(function (oDialog) {
                        this._oDialogAgregarRegistro = oDialog;
                        this.getView().addDependent(oDialog);
                        this._mostrarCamposDialog(action, oContextData);
                        oDialog.open();
                    }.bind(this));
                } else {
                    this._oDialogAgregarRegistro.open();
                    this._mostrarCamposDialog(action, oContextData);
                }
            },

            _mostrarCamposDialog: function (action, oContextData) {
                const viewId = this.getView().createId("dAgregarRegistro");
                const proceso = this.slctProceso.getSelectedKey();

                // Mapeo de controles por ID
                const campos = {
                    lblInputCeco: this.byId(viewId + "--lblInputCeco"),
                    inptCeco: this.byId(viewId + "--inptCeco"),
                    inptDescripcion: this.byId(viewId + "--inptDescripcion"),
                    cboxUsuario: this.byId(viewId + "--cboxUsuario"),
                    cboxResponsable: this.byId(viewId + "--cboxResponsable"),
                    inptDepartamento: this.byId(viewId + "--inptDepartamento"),
                    cboxClase: this.byId(viewId + "--cboxClase"),
                    cboxAreaJerarquica: this.byId(viewId + "--cboxAreaJerarquica"),
                    cboxSociedad: this.byId(viewId + "--cboxSociedad"),
                    cboxAreaFuncional: this.byId(viewId + "--cboxAreaFuncional"),
                    cboxMoneda: this.byId(viewId + "--cboxMoneda"),
                    cboxCentroBeneficio: this.byId(viewId + "--cboxCentroBeneficio"),
                    inptCege: this.byId(viewId + "--inptCege")
                };

                // Limpiar campos
                Object.entries(campos).forEach(([id, control]) => {
                    if (control.setValue) control.setValue(null);
                    if (control.setSelectedKey) control.setSelectedKey(null);
                });

                const alias = { "0004": "0001", "0005": "0002", "0006": "0003" };
                const p = alias[proceso] || proceso;

                // Configuración de campos por proceso base
                const configProceso = {
                    "0001": {
                        label: this.txtCentroCosto,
                        visible: [
                            "inptCeco", "inptDescripcion", "cboxUsuario", "cboxResponsable", "inptDepartamento",
                            "cboxClase", "cboxAreaJerarquica", "cboxSociedad", "cboxAreaFuncional",
                            "cboxMoneda", "cboxCentroBeneficio", "inptCege"
                        ]
                    },
                    "0002": {
                        label: this.txtCentroBeneficio,
                        visible: [
                            "inptCeco", "inptDescripcion", "cboxUsuario", "cboxResponsable",
                            "inptDepartamento", "cboxAreaJerarquica"
                        ]
                    },
                    "0003": {
                        label: this.txtCentroGestor,
                        visible: [
                            "inptCeco", "inptDescripcion", "cboxUsuario", "cboxResponsable",
                            "cboxAreaJerarquica", "cboxSociedad"
                        ]
                    }
                };

                // Usa la config (con fallback minimal)
                const config = configProceso[p] || { label: "", visible: [] };
                campos.lblInputCeco.setText(config.label);

                // Aplicar visibilidad
                Object.entries(campos).forEach(([id, control]) => {
                    if (id !== "lblInputCeco" && control.setVisible) {
                        control.setVisible(config.visible.includes(id));
                    }
                });

                // Si es edición, llenar campos visibles
                if (action === "editar" && oContextData) {
                    const mapeoCampos = {
                        inptCeco: { key: "centro", metodo: "setValue" },
                        inptDescripcion: { key: "denominacion", metodo: "setValue" },
                        cboxUsuario: { key: "usuario", metodo: "setSelectedKey" },
                        cboxResponsable: { key: "responsable", metodo: "setSelectedKey" },
                        inptDepartamento: { key: "departamento", metodo: "setValue" },
                        cboxClase: { key: "claseCeCo", metodo: "setSelectedKey" },
                        cboxAreaJerarquica: { key: "areaJerarquia", metodo: "setSelectedKey" },
                        cboxSociedad: { key: "sociedad", metodo: "setSelectedKey" },
                        cboxAreaFuncional: { key: "areaFuncional", metodo: "setSelectedKey" },
                        cboxMoneda: { key: "moneda", metodo: "setSelectedKey" },
                        cboxCentroBeneficio: { key: "cEBE", metodo: "setSelectedKey" },
                        inptCege: { key: "derivarACeGe", metodo: "setValue" }
                    };

                    config.visible.forEach(id => {
                        const control = campos[id];
                        const campo = mapeoCampos[id];

                        if (campo && oContextData.hasOwnProperty(campo.key)) {
                            const valor = oContextData[campo.key];
                            if (campo.metodo === "setSelectedKey") {
                                control.setSelectedKey(valor);
                            } else if (campo.metodo === "setValue") {
                                control.setValue(valor);
                            }
                        }
                    });
                }
            },

            _mostrarCamposDialogDir: function (action, oContextData) {
                const viewId = this.getView().createId("dAgregarDireccion");

                // Mapeo de controles por ID
                const campos = {
                    inptCentroDir: this.byId(viewId + "--inptCentroDir"),
                    inptCalle: this.byId(viewId + "--inptCalle"),
                    inptColonia: this.byId(viewId + "--inptColonia"),
                    inptPoblacion: this.byId(viewId + "--inptPoblacion"),
                    inptCodigoPostal: this.byId(viewId + "--inptCodigoPostal"),
                    slctRegion: this.byId(viewId + "--slctRegion"),
                    slctPais: this.byId(viewId + "--slctPais")
                };

                // Limpiar campos
                Object.entries(campos).forEach(([id, control]) => {
                    if (control.setValue) control.setValue(null);
                    if (control.setSelectedKey) control.setSelectedKey(null);
                });

                // Si es edición, llenar campos visibles
                if (action === "editar" && oContextData) {
                    const mapeoCampos = {
                        inptCentroDir: { key: "centro", metodo: "setSelectedKey" },
                        inptCalle: { key: "calle", metodo: "setValue" },
                        inptColonia: { key: "colonia", metodo: "setValue" },
                        inptPoblacion: { key: "poblacion", metodo: "setValue" },
                        inptCodigoPostal: { key: "codigoPostal", metodo: "setValue" },
                        slctRegion: { key: "region", metodo: "setSelectedKey" },
                        slctPais: { key: "pais", metodo: "setSelectedKey" }
                    };

                    Object.keys(campos).forEach(id => {
                        const control = campos[id];
                        const campo = mapeoCampos[id];

                        if (campo && oContextData.hasOwnProperty(campo.key)) {
                            const valor = oContextData[campo.key];
                            if (campo.metodo === "setSelectedKey") {
                                control.setSelectedKey(valor);
                            } else if (campo.metodo === "setValue") {
                                control.setValue(valor);
                            }
                        }
                    });
                }
            },

            _getObtejoCentroNuevo: function () {
                const proceso = this.slctProceso.getSelectedKey();
                const viewId = this.getView().createId("dAgregarRegistro");
                const inptCeco = this.byId(viewId + "--inptCeco");
                const inptDescripcion = this.byId(viewId + "--inptDescripcion");
                const cboxUsuario = this.byId(viewId + "--cboxUsuario");
                const cboxResponsable = this.byId(viewId + "--cboxResponsable");
                const inptDepartamento = this.byId(viewId + "--inptDepartamento");
                const cboxClase = this.byId(viewId + "--cboxClase");
                const cboxAreaJerarquica = this.byId(viewId + "--cboxAreaJerarquica");
                const cboxSociedad = this.byId(viewId + "--cboxSociedad");
                const cboxAreaFuncional = this.byId(viewId + "--cboxAreaFuncional");
                const cboxMoneda = this.byId(viewId + "--cboxMoneda");
                const cboxCentroBeneficio = this.byId(viewId + "--cboxCentroBeneficio");
                const inptCege = this.byId(viewId + "--inptCege");

                const ceco = inptCeco ? inptCeco.getValue() : null;
                const descripcion = inptDescripcion ? inptDescripcion.getValue() : null;
                const usuario = cboxUsuario ? cboxUsuario.getSelectedKey() : null;
                const responsable = cboxResponsable ? cboxResponsable.getSelectedKey() : null;
                const departamento = inptDepartamento ? inptDepartamento.getValue() : null;
                const clase = cboxClase ? cboxClase.getSelectedKey() : null;
                const areaJerarquica = cboxAreaJerarquica ? cboxAreaJerarquica.getSelectedKey() : null;
                const sociedad = cboxSociedad ? cboxSociedad.getSelectedKey() : null;
                const areaFuncional = cboxAreaFuncional ? cboxAreaFuncional.getSelectedKey() : null;
                const moneda = cboxMoneda ? cboxMoneda.getSelectedKey() : null;
                const centroBeneficio = cboxCentroBeneficio ? cboxCentroBeneficio.getSelectedKey() : null;
                const cege = inptCege ? inptCege.getValue() : null;

                if (!ceco) return MessageToast.show("Por favor, llene el campo CECO");
                if (!descripcion) return MessageToast.show("Por favor, llene el campo Descripción");
                if (!usuario) return MessageToast.show("Por favor, seleccione un Usuario");
                if (!responsable) return MessageToast.show("Por favor, seleccione un Responsable");

                if (proceso === "0001" || proceso === "0004") {
                    if (!departamento) return MessageToast.show("Por favor, llene el campo Departamento");
                    if (!clase) return MessageToast.show("Por favor, seleccione una Clase");
                    if (!areaJerarquica) return MessageToast.show("Por favor, seleccione un Área Jerárquica");
                    if (!sociedad) return MessageToast.show("Por favor, seleccione una Sociedad");
                    if (!areaFuncional) return MessageToast.show("Por favor, seleccione un Área Funcional");
                    if (!moneda) return MessageToast.show("Por favor, seleccione una Moneda");
                    if (!centroBeneficio) return MessageToast.show("Por favor, seleccione un Centro de Beneficio");
                    if (!cege) return MessageToast.show("Por favor, llene el campo CEGE");

                    return {
                        centro: parseInt(ceco),
                        denominacion: descripcion,
                        usuario,
                        responsable,
                        departamento,
                        claseCeCo: clase,
                        areaJerarquia: parseInt(areaJerarquica),
                        sociedad: parseInt(sociedad),
                        areaFuncional,
                        moneda,
                        cEBE: parseInt(centroBeneficio),
                        derivarACeGe: parseInt(cege)
                    };
                }

                if (proceso === "0002" || proceso === "0005") {
                    if (!departamento) return MessageToast.show("Por favor, llene el campo Departamento");
                    if (!areaJerarquica) return MessageToast.show("Por favor, seleccione un Área Jerárquica");

                    return {
                        centro: parseInt(ceco),
                        denominacion: descripcion,
                        usuario,
                        responsable,
                        departamento,
                        areaJerarquia: parseInt(areaJerarquica)
                    };
                }

                if (proceso === "0003"  || proceso === "0006") {
                    if (!areaJerarquica) return MessageToast.show("Por favor, seleccione un Área Jerárquica");
                    if (!sociedad) return MessageToast.show("Por favor, seleccione una Sociedad");

                    return {
                        centro: parseInt(ceco),
                        denominacion: descripcion,
                        usuario,
                        responsable,
                        areaJerarquia: parseInt(areaJerarquica),
                        sociedad: parseInt(sociedad)
                    };
                }

                MessageToast.show("Proceso no reconocido");
                return;
            },

            _getObjetoDireccionNueva: function () {
                const viewId = this.getView().createId("dAgregarDireccion");

                const inptCentroDir = this.byId(viewId + "--inptCentroDir");
                const inptCalle = this.byId(viewId + "--inptCalle");
                const inptColonia = this.byId(viewId + "--inptColonia");
                const inptPoblacion = this.byId(viewId + "--inptPoblacion");
                const inptCodigoPostal = this.byId(viewId + "--inptCodigoPostal");
                const slctRegion = this.byId(viewId + "--slctRegion");
                const slctPais = this.byId(viewId + "--slctPais");

                const centro = inptCentroDir ? inptCentroDir.getSelectedKey() : null;
                const calle = inptCalle ? inptCalle.getValue() : null;
                const colonia = inptColonia ? inptColonia.getValue() : null;
                const poblacion = inptPoblacion ? inptPoblacion.getValue() : null;
                const codigoPostal = inptCodigoPostal ? inptCodigoPostal.getValue() : null;
                const region = slctRegion ? slctRegion.getSelectedKey() : null;
                const pais = slctPais ? slctPais.getSelectedKey() : null;

                // Validaciones básicas
                if (!centro) return MessageToast.show("Por favor, seleccione un Centro de Costo");
                if (!calle) return MessageToast.show("Por favor, llene el campo Calle");
                if (!colonia) return MessageToast.show("Por favor, llene el campo Colonia");
                if (!poblacion) return MessageToast.show("Por favor, llene el campo Población");
                if (!codigoPostal) return MessageToast.show("Por favor, llene el campo Código Postal");
                if (!region) return MessageToast.show("Por favor, seleccione una Región");
                if (!pais) return MessageToast.show("Por favor, seleccione un País");

                // Objeto con todas las propiedades esperadas por el modelo 'Direccion'
                return {
                    centro: centro,
                    calle: calle,
                    colonia: colonia,
                    poblacion: poblacion,
                    codigoPostal: codigoPostal,
                    region: region,
                    pais: pais
                };
            },

            _getObjetoBloqueoNuevo: function () {
                const viewId = this.getView().createId("dAgregarBloqueo");

                const inptCentroBloq = this.byId(viewId + "--inptCentroBloq");

                const chkRealesPrimarios = this.byId(viewId + "--chkRealesPrimarios");
                const chkRealesSecundarios = this.byId(viewId + "--chkRealesSecundarios");
                const chkRealesIngresos = this.byId(viewId + "--chkRealesIngresos");

                const chkPlanPrimarios = this.byId(viewId + "--chkPlanPrimarios");
                const chkPlanSecundarios = this.byId(viewId + "--chkPlanSecundarios");
                const chkPlanIngresos = this.byId(viewId + "--chkPlanIngresos");

                const chkComprometido = this.byId(viewId + "--chkComprometido");

                const centro = inptCentroBloq ? inptCentroBloq.getSelectedKey() : null;

                // Validación básica
                if (!centro) return MessageToast.show("Por favor, seleccione un Centro de Costo");

                return {
                    centro: centro,
                    costesPrimariosReales: chkRealesPrimarios?.getSelected() ? "X" : "",
                    costesPrimariosPlanificados: chkPlanPrimarios?.getSelected() ? "X" : "",
                    costesSecundariosReales: chkRealesSecundarios?.getSelected() ? "X" : "",
                    costesSecundariosPlanificados: chkPlanSecundarios?.getSelected() ? "X" : "",
                    ingresosReales: chkRealesIngresos?.getSelected() ? "X" : "",
                    ingresosPlanificados: chkPlanIngresos?.getSelected() ? "X" : "",
                    comprometido: chkComprometido?.getSelected() ? "X" : ""
                };
            },

            onAgregarRegistro: function () {
                const oNewCentro = this._getObtejoCentroNuevo();

                if (!oNewCentro || typeof oNewCentro !== "object") {
                    console.warn("No se pudo obtener un centro válido.");
                    return;
                }

                let currentData = this.mCentro.getData();
                currentData = Array.isArray(currentData) ? [...currentData] : [];

                if (action === "editar" && this._itemEnEdicion) {
                    const index = currentData.findIndex(item =>
                        item.centro === this._itemEnEdicion.centro
                    );

                    if (index !== -1) {
                        currentData[index] = oNewCentro;
                        this.mCentro.setData(currentData);
                        this.onCerrarAgregarRegistro();
                        return;
                    } else {
                        console.warn("No se encontró el item a editar en el modelo.");
                    }
                }

                // Validar duplicados solo al crear
                const exists = currentData.some(item => item.centro === oNewCentro.centro);
                if (exists) {
                    MessageToast.show("Este centro ya ha sido agregado.");
                    return;
                }

                // Agregar nuevo registro
                currentData.push(oNewCentro);
                this.mCentro.setData(currentData);
                this.onCerrarAgregarRegistro();
            },

            onCerrarAgregarRegistro: function () {
                this._oDialogAgregarRegistro.close();
            },

            onOpenCargaExcel: function (oEvent) {
                const sCarga = oEvent.getSource().getCustomData()[0].getValue();
                tipoCargaExcel = sCarga;
                if (!this._oDialogCargaExcel) {
                    Fragment.load({
                        id: this.getView().createId("dCargaExcel"),
                        name: "creacionflujocecos.view.fragment.CargarExcel",
                        controller: this
                    }).then(function (oDialog) {
                        this._oDialogCargaExcel = oDialog;
                        this.getView().addDependent(oDialog);
                        oDialog.open();
                    }.bind(this));
                } else {
                    this._oDialogCargaExcel.open();
                }
            },

            onCloseCargarExcel: function () {
                if (this._oDialogCargaExcel) {
                    this._oDialogCargaExcel.close();
                }
            },

            onCargar: async function () {
                const that = this;
                const oFileUploader = this.byId("dCargaExcel--fileUploader");
                const oFile = oFileUploader?.getFocusDomRef()?.files?.[0];

                if (!oFile) {
                    MessageToast.show("Por favor selecciona un archivo Excel.");
                    return;
                }

                try {
                    await this.loadSheetJSLibrary();
                } catch (e) {
                    MessageBox.error(e);
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: "array" });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: "", range: 1 });
                    const newData = that.transformKeysToCamelCase(rawJson);

                    const modelos = {
                        centros: that.mCentro,
                        direcciones: that.mDireccion,
                        bloqueos: that.mBloqueo
                    };

                    const model = modelos[tipoCargaExcel];
                    if (!model) {
                        MessageToast.show("Tipo de carga no válida.");
                        return;
                    }

                    const currentData = Array.isArray(model.getData()) ? model.getData() : [];

                    // Validar existencia de centros si aplica
                    const centrosModelData = that.mCentro.getData();
                    const necesitaValidarCentro = tipoCargaExcel === "direcciones" || tipoCargaExcel === "bloqueos";

                    if (necesitaValidarCentro && (!Array.isArray(centrosModelData) || centrosModelData.length === 0)) {
                        MessageToast.show("Debe cargar centros antes de registrar direcciones o bloqueos.");
                        oFileUploader.setValue(null);
                        return;
                    }

                    const centrosValidos = new Set(
                        necesitaValidarCentro ? centrosModelData.map(item => item.centro) : []
                    );

                    const filteredNewData = newData.filter(newItem => {
                        const noDuplicado = !currentData.some(existing => existing.centro === newItem.centro);
                        const centroValido = necesitaValidarCentro ? centrosValidos.has(newItem.centro) : true;
                        return noDuplicado && centroValido;
                    });

                    model.setData([...currentData, ...filteredNewData]);

                    that.onCloseCargarExcel();
                    MessageToast.show("Archivo Excel cargado.");
                    oFileUploader.setValue(null);
                };

                reader.readAsArrayBuffer(oFile);
            },

            onDescargarPlantilla: function (oEvent) {
                const sParametro = oEvent.getSource().getCustomData()[0].getValue();
                const proceso = this.slctProceso.getSelectedKey();
                let filename = "";

                if (sParametro === "centros") {
                    if (proceso === "0001" || proceso === "0004") {
                        filename = "Carga_de_Cecos.xlsx"
                    } else if (proceso === "0002" || proceso === "0005") {
                        filename = "Carga_de_Cebes.xlsx"
                    } else if (proceso === "0003" || proceso === "0006") {
                        filename = "Carga_de_Ceges.xlsx"
                    } else {
                        MessageToast.show("Proceso seleccionado no reconocido.");
                        return
                    }
                } else if (sParametro === "direcciones") {
                    filename = "Carga_de_Direcciones.xlsx"
                } else if (sParametro === "bloqueos") {
                    filename = "Carga_de_Bloqueos.xlsx"
                }

                const sPath = sap.ui.require.toUrl(`creacionflujocecos/assets/${filename}`);
                const link = document.createElement("a");
                link.href = sPath;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },

            onEliminar: function () {
                const selectedItems = this.tableCentros.getSelectedItems();

                if (selectedItems.length === 0) {
                    MessageToast.show("Selecciona al menos un registro para eliminar.");
                    return;
                }

                const that = this;
                MessageBox.show("¿Estás seguro de que deseas eliminar los registros seleccionados?", {
                    icon: MessageBox.Icon.QUESTION,
                    title: "Confirmación",
                    actions: ["Sí", "No"],
                    emphasizedAction: "Sí",
                    onClose: function (oAction) {
                        if (oAction === "Sí") {
                            const aData = that.mCentro.getData();
                            const updatedData = aData.filter(item => {
                                return !selectedItems.some(sel => sel.getBindingContext("Centro").getObject() === item);
                            });

                            that.mCentro.setData(updatedData);
                            that.tableCentros.removeSelections(true); // 🔹 Limpia la selección
                            MessageToast.show("Registros eliminados exitosamente.");
                        }
                    }
                });
            },

            onEliminarDireccion: function () {
                const selectedItems = this.tableDirecciones.getSelectedItems();

                if (selectedItems.length === 0) {
                    MessageToast.show("Selecciona al menos un registro para eliminar.");
                    return;
                }

                const that = this;
                MessageBox.show("¿Estás seguro de que deseas eliminar los registros seleccionados?", {
                    icon: MessageBox.Icon.QUESTION,
                    title: "Confirmación",
                    actions: ["Sí", "No"],
                    emphasizedAction: "Sí",
                    onClose: function (oAction) {
                        if (oAction === "Sí") {
                            const aData = that.mDireccion.getData();
                            const updatedData = aData.filter(item => {
                                return !selectedItems.some(sel => sel.getBindingContext("Direccion").getObject() === item);
                            });

                            that.mDireccion.setData(updatedData);
                            that.tableDirecciones.removeSelections(true); // 🔹 Limpia la selección
                            MessageToast.show("Registros eliminados exitosamente.");
                        }
                    }
                });
            },

            onEliminarBloqueo: function () {
                const selectedItems = this.tableBloqueos.getSelectedItems();

                if (selectedItems.length === 0) {
                    MessageToast.show("Selecciona al menos un registro para eliminar.");
                    return;
                }

                const that = this;
                MessageBox.show("¿Estás seguro de que deseas eliminar los registros seleccionados?", {
                    icon: MessageBox.Icon.QUESTION,
                    title: "Confirmación",
                    actions: ["Sí", "No"],
                    emphasizedAction: "Sí",
                    onClose: function (oAction) {
                        if (oAction === "Sí") {
                            const aData = that.mBloqueo.getData();
                            const updatedData = aData.filter(item => {
                                return !selectedItems.some(sel => sel.getBindingContext("Bloqueo").getObject() === item);
                            });

                            that.mBloqueo.setData(updatedData);
                            that.tableBloqueos.removeSelections(true); // 🔹 Limpia la selección
                            MessageToast.show("Registros eliminados exitosamente.");
                        }
                    }
                });
            },

            onOpenAgregarDireccion: function (oEvent) {
                action = oEvent.getSource().getCustomData()[0].getValue();
                let oContextData = null;
                if (action === "editar") {
                    const oItem = oEvent.getSource().getParent();
                    const oContext = oItem.getBindingContext("Direccion");
                    if (oContext) {
                        oContextData = oContext.getObject();
                        this._itemEnEdicion = oContextData;
                    }
                }

                if (!this._oDialogAgregarDireccion) {
                    Fragment.load({
                        id: this.getView().createId("dAgregarDireccion"),
                        name: "creacionflujocecos.view.fragment.AgregarDireccion",
                        controller: this
                    }).then(function (oDialog) {
                        this._oDialogAgregarDireccion = oDialog;
                        this.getView().addDependent(oDialog);
                        this._mostrarCamposDialogDir(action, oContextData);
                        oDialog.open();
                    }.bind(this));
                } else {
                    this._oDialogAgregarDireccion.open();
                    this._mostrarCamposDialogDir(action, oContextData);
                }
            },

            onAgregarDireccion: function () {
                const oNewDireccion = this._getObjetoDireccionNueva();

                if (!oNewDireccion || typeof oNewDireccion !== "object") {
                    console.warn("No se pudo obtener una dirección válida.");
                    return;
                }

                let currentData = this.mDireccion.getData();
                currentData = Array.isArray(currentData) ? [...currentData] : [];

                if (action === "editar" && this._itemEnEdicion) {
                    const index = currentData.findIndex(item =>
                        item.centro === this._itemEnEdicion.centro
                    );

                    if (index !== -1) {
                        currentData[index] = oNewDireccion;
                        this.mDireccion.setData(currentData);
                        this.onCerrarAgregarDireccion();
                        return;
                    } else {
                        console.warn("No se encontró el item a editar en el modelo.");
                    }
                }

                // Validar duplicados solo al crear
                const exists = currentData.some(item => item.centro === oNewDireccion.centro);
                if (exists) {
                    MessageToast.show("Esta dirección ya ha sido agregada.");
                    return;
                }

                // Agregar nuevo registro
                currentData.push(oNewDireccion);
                this.mDireccion.setData(currentData);
                this.onCerrarAgregarDireccion();
            },

            onCerrarAgregarDireccion: function () {
                this._oDialogAgregarDireccion.close();
            },

            onOpenAgregarBloqueo: function () {
                if (!this._oDialogAgregarBloqueo) {
                    Fragment.load({
                        id: this.getView().createId("dAgregarBloqueo"),
                        name: "creacionflujocecos.view.fragment.AgregarBloqueo",
                        controller: this
                    }).then(function (oDialog) {
                        this._oDialogAgregarBloqueo = oDialog;
                        this.getView().addDependent(oDialog);
                        oDialog.open();
                    }.bind(this));
                } else {
                    this._oDialogAgregarBloqueo.open();
                }
            },

            onAgregarBloqueo: function () {
                const oNewBloqueo = this._getObjetoBloqueoNuevo();

                if (!oNewBloqueo || typeof oNewBloqueo !== "object") {
                    console.warn("No se pudo obtener un bloqueo válido.");
                    return;
                }

                let currentData = this.mBloqueo.getData();
                currentData = Array.isArray(currentData) ? [...currentData] : [];

                // Validar duplicados solo al crear
                const exists = currentData.some(item => item.centro === oNewBloqueo.centro);
                if (exists) {
                    MessageToast.show("Este centro ya tiene bloqueos.");
                    return;
                }

                // Agregar nuevo registro
                currentData.push(oNewBloqueo);
                this.mBloqueo.setData(currentData);
                this.onCerrarAgregarBloqueo();
            },

            onCerrarAgregarBloqueo: function () {
                this._oDialogAgregarBloqueo.close();
            },

            loadSheetJSLibrary: function () {
                return new Promise((resolve, reject) => {
                    if (window.XLSX) {
                        resolve();
                        return;
                    }

                    const script = document.createElement("script");
                    script.src = "/sap/bc/ui5_ui5/sap/zfi_flujo_cecos/libs/xlsx.full.min.js"; // ✅ Ruta directa que sí funciona
                    script.onload = resolve;
                    script.onerror = () => reject("No se pudo cargar SheetJS.");
                    document.head.appendChild(script);
                });
            },

            toCamelCase: function (str) {
                return str
                    .normalize("NFD") // elimina acentos
                    .replace(/[\u0300-\u036f]/g, "") // borra restos de acentos
                    .replace(/[^a-zA-Z0-9 ]/g, "") // elimina caracteres especiales
                    .replace(/\s+(.)/g, (_, char) => char.toUpperCase()) // camelCase
                    .replace(/^./, (char) => char.toLowerCase()); // primera minúscula
            },

            transformKeysToCamelCase: function (data) {
                return data.map(item => {
                    const newItem = {};
                    for (const key in item) {
                        const newKey = this.toCamelCase(key);
                        newItem[newKey] = item[key];
                    }
                    return newItem;
                });
            },

            onCrearCentros: function () {
                const that = this;
                const oView = this.getView()
                const proceso = this.slctProceso.getSelectedKey();

                if (!this.mCentro.getData().length || this.mCentro.getData().length === 0) {
                    MessageToast.show("Agregue centros para crearlos.");
                    return
                } else {
                    oView.setBusy(true);
                    let body = this.getDataCreacion(proceso);
                    this.ZSERV_CBG_CREATE_SRV.create("/HeaderSet", body, {
                        headers: {
                            "Content-Type": "application/json;charset=utf-8"
                        },
                        success: function (response) {
                            MessageToast.show("Centros creados con exito.");
                            oView.setBusy(false);
                            that.onLoadMatchcodes("0001")
                            that.onResetFields();
                            that.oRouter.navTo("RouteMaster", {}, true);
                        },
                        error: function (error) {
                            console.log(error)
                            MessageToast.show("Ocurrió un error al crear los centros.");
                            oView.setBusy(false);
                        }
                    });
                }
            },

            getDataCreacion: function (proceso) {

                let centros = this.transformarCentros(this.mCentro.getData(), proceso);
                let direcciones = this.transformarDirecciones(this.mDireccion.getData());
                let control = this.transformarBloqueos(this.tableBloqueos.getItems(), proceso)

                let body = {
                    Proceso: this.slctProceso.getSelectedKey(),
                    Flujo: this.slctFlujo.getSelectedKey(),
                    Usuario: this.sUserId,
                    Consecutivo: this.inptConsecutivo.getValue(),
                    Headdir_nav: direcciones,
                    Headctrl_nav: control
                }

                if (proceso === "0001" || proceso === "0004") {
                    body["Headceco_nav"] = centros
                } else if (proceso === "0002" || proceso === "0005") {
                    body["Headcebe_nav"] = centros
                } else if (proceso === "0003" || proceso === "0006") {
                    body["Headceges_nav"] = centros
                }

                return body;
            },

            transformarCentros: function (arrayOriginal, proceso) {

                let centros = [];
                switch (proceso) {
                    case "0001" || "0004":
                        centros = arrayOriginal.map(item => ({
                            Cecosto: item.centro?.toString() || "",
                            Descripcion: item.denominacion || "",
                            Usuario: item.usuario || "",
                            Responsable: item.responsable || "",
                            Depto: item.departamento || "",
                            Clasececo: item.claseCeCo || "",
                            AreaJerar: item.areaJerarquia?.toString() || "",
                            Sociedad: item.sociedad?.toString() || "",
                            AreaFunc: item.areaFuncional || "",
                            Moneda: item.moneda || "",
                            Cebe: isNaN(item.cEBE) ? "" : item.cEBE?.toString(),
                            Derivarcege: item.derivarACeGe?.toString() || ""
                        }));
                        break
                    case "0002" || "0005":
                        centros = arrayOriginal.map(item => ({
                            Cebeneficio: item.centro?.toString() || "",
                            Descripcion: item.denominacion || "",
                            Usuario: item.usuario || "",
                            Responsable: item.responsable || "",
                            Departamento: item.departamento || "",
                            AreaJerar: item.areaJerarquia?.toString() || ""
                        }));
                        break
                    case "0003" || "0006":
                        centros = arrayOriginal.map(item => ({
                            Cegestor: item.centro?.toString() || "",
                            Descripcion: item.denominacion || "",
                            Usuario: item.usuario || "",
                            Responsable: item.responsable || "",
                            AreaJerar: item.areaJerarquia?.toString() || "",
                            Sociedad: item.sociedad?.toString() || "",
                        }));
                        break
                    default:
                        centros = []
                        break
                }

                return centros
            },

            transformarDirecciones: function (arrayOriginal) {
                return arrayOriginal.map(item => ({
                    Cecosto: item.centro?.toString() || "",
                    Calle: item.calle || "",
                    Colonia: item.colonia || "",
                    Poblacion: item.poblacion || "",
                    Cp: item.codigoPostal?.toString() || "",
                    Region: item.region || "",
                    Pais: item.pais || ""
                }));
            },

            transformarBloqueos: function (arrayOriginal, proceso) {
                if (proceso === "0001" || proceso === "0004") {
                    return arrayOriginal.map((oItem) => {
                        const oObj = oItem.getBindingContext("Bloqueo").getObject();
                        const aCells = oItem.getCells(); // [0]=Text centro, [1..7]=CheckBox
                        const x = (i) => (aCells[i].getSelected ? (aCells[i].getSelected() ? "X" : "") : "");
                        return {
                            Cecosto: aCells[0].getText(), // Ceco
                            Cprimarios_r: x(1), // Costes Primarios Reales
                            Cprimarios_p: x(2), // Costes Primarios Planificados
                            Csecundarios_r: x(3), // Costes Secundarios Reales
                            Csecundarios_p: x(4), // Costes Secundarios Planificados
                            Ingresos_r: x(5), // Ingresos Reales
                            Ingresos_p: x(6), // Ingresos Planificados
                            Comprometido: x(7), // Comprometido
                        };
                    });
                } else {
                    return [];
                }
            },

            onResetFields: function () {
                const procesos = this.mProceso.getProperty("/");
                if (procesos && procesos.length > 0) {
                    const proceso = procesos[0]["Valor"];
                    this.slctProceso.setSelectedKey(proceso);
                }

                const consecutivos = this.mConsecutivo.getProperty("/");
                if (consecutivos && consecutivos.length > 0) {
                    const consecutivo = consecutivos[0]["Valor"];
                    this.inptConsecutivo.setValue(consecutivo);
                }

                const flujos = this.mFlujo.getProperty("/");
                if (flujos && flujos.length > 0) {
                    const flujo = flujos[0]["Valor"];
                    this.slctFlujo.setSelectedKey(flujo);
                }

                this.mCentro.setData([]);
                this.mDireccion.setData([]);
                this.mBloqueo.setData([]);
                this.idIconTabBar.setSelectedKey("datos")
            },

            onLoadDetail: function () {
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
                        if (response.results.length > 0) {
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
            }
        });
    });
