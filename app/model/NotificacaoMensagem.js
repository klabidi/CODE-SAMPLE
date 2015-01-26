Ext.define("Eagle.model.NotificacaoMensagem", {
    extend: "Ext.data.Model",
    requires: ["Eagle.model.Notificacao"],
    fields: [
        {name: "remetente", type: "string"},
        {name: "mensagem", type: "string"},
        {name: "veiculo", reference: "Veiculo"},
        {name: "usuario", type: "int"},
        
        //Mapeamento para o grid pois não suporta dataIndex: "veiculo.placa"
        {name: "placa", type: "string", mapping: function(data){return data.veiculo.placa;}},
        {name: "frota", type: "string", mapping: function(data){return data.veiculo.frota;}}
    ],
    idProperty: "idNotificacao"
});