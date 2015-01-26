Ext.define("Eagle.model.PontoAlvo", {
    extend: "Ext.data.Model",
    
    fields: [
        {name: "placa", type: "string"},
        {name: "distancia", type: "number"},
        {name: "data", type: "date"},
        {name: "empresa", type: "int"},
        {name: "idReferencia", type: "int"},
        {name: "descReferencia", type: "string"}
    ]
});