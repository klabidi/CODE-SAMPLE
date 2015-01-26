Ext.define("Eagle.model.VeiculoInformacao", {
    extend: "Ext.data.Model",
    
    fields: [
        {name: "placa", type: "string"},
        {name: "serial", type: "string"},
        {name: "frota", type: "string"},
        {name: "empresa", type: "string"},
        {name: "marca", type: "string"},
        {name: "cor", type: "string"},
        {name: "condutor", type: "string"},
        {name: "aparelho", type: "string"},
        {name: "acessorios"},
        {name: "satelital", type: "boolean"}
    ],
    idProperty: "placa"
});