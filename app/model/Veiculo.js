Ext.define("Eagle.model.Veiculo", {
    extend: "Ext.data.Model",
    fields: [
        {name: "placa", type: "string"},
        {name: "frota", type: "string"},
        {name: "serial", type: "string"},
        {name: "marca", type: "string"},
        {name: "condutor", type: "string"},
        {name: "ultimaConexao", type: "string"},
        {name: "empresa", type: "string"},
        {name: "cor", type: "string"},
        {name: "central", type: "string"},
        {name: "satelite", type: "string"}
    ]
});