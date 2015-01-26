Ext.define("Eagle.model.VeiculoAcessorio", {
    extend: "Ext.data.Model",
    fields: [
        {name: "placa", type: "string"},
        {name: "velocidade", type: "boolean"},
        {name: "velocidadeChuva", type: "boolean"},
        {name: "avisoMotorista", type: "boolean"},
        {name: "rpm", type: "boolean"}
    ],
    idProperty: "placa"
});