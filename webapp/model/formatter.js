sap.ui.define([
	"sap/ui/core/library"
], function (coreLibrary) {
    "use strict";

	const {ValueState} = coreLibrary;

    return {
        xToBoolean: function (value) {
            return value === "X";
        },
        formatDateShort: function (iDate) {
			if (!iDate) {
				return null;
			}

			let sDate = iDate.toString().trim();
			let dateObject;

			if (sDate.length === 8 && /^\d{8}$/.test(sDate)) {
				// Formato yyyyMMdd
				let year = sDate.substring(0, 4);
				let month = sDate.substring(4, 6);
				let day = sDate.substring(6, 8);
				dateObject = new Date(Date.UTC(year, month - 1, day));
			} else if (sDate.length === 10 && sDate.includes('.')) {
				// Formato dd.MM.yyyy
				let [day, month, year] = sDate.split('.');
				if (day && month && year) {
					dateObject = new Date(Date.UTC(year, month - 1, day));
				}
			} else {
				return null;
			}

			if (isNaN(dateObject.getTime())) {
				return null;
			}

			sap.ui.getCore().getConfiguration().setFormatLocale("es");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				style: "medium"
			});

			var formattedDate = oDateFormat.format(dateObject);

			return formattedDate;
		},
		formatStatusText(sStatus) {
			if (sStatus === "CREADA") {
				return "En Proceso";
			} else if (sStatus === "RECHAZADA") {
				return "Rechazada";
			} else if (sStatus === "APROBADA"){
				return "Aprobada";
			} else {
				return "Desconocido";
			}
		},
		formatStatusState(sStatus) {
			if (sStatus === "RECHAZADA") {
				return ValueState.Error;
			} else if (sStatus === "APROBADA") {
				return ValueState.Success;
			} else if (sStatus === "CREADA"){
				return ValueState.Warning;
			} else {
				return ValueState.None;
			}
		}
    };
});
