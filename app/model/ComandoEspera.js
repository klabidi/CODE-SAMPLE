Ext.define("Eagle.model.ComandoEspera", {
    extend: "Ext.data.Model",
    
    fields: [
        {name: "idComando", type: "int"},
        {name: "placa", type: "string"},
        {name: "comando", type: "string"},
        {name: "parametro", type: "string"},
        {name: "data", type: "date", dateFormat: "d/m/Y H:i"},
        {name: "requerente", type: "string"},
        {name: "satelite", type: "boolean"}
    ],
    idProperty: "idComando"
});