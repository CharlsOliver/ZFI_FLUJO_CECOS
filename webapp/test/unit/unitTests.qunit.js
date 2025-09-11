/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"creacion_flujo_cecos/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
