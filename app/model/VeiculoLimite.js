Ext.define("Eagle.model.VeiculoLimite", {
    extend: "Ext.data.Model",
    
    fields: [
        {name: "idLimite", type: "int"},
        {name: "placa", type: "string"},
        {name: "velocidade", type: "int"},
        {name: "velocidadeChuva", type: "int"},
        {name: "rpmMaximo", type: "int"},
        {name: "rpmMinimo", type: "int"}
    ],
    idProperty: "idLimite"
});