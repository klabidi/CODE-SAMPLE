Ext.define("Eagle.model.NotificacaoEvento", {
    extend: "Ext.data.Model",
    requires: ["Eagle.model.Notificacao"],
    fields: [
        {name: "codigo", type: "int"},
        {name: "parametro", type: "string"},
        {name: "veiculo", reference: "Veiculo"},
        
        //Mapeamento para o grid pois não suporta dataIndex: "veiculo.placa"
        {name: "placa", type: "string", mapping: function(data){return data.veiculo.placa;}},
        {name: "frota", type: "string", mapping: function(data){return data.veiculo.frota;}}
    ],
    idProperty: "idNotificacao"
});