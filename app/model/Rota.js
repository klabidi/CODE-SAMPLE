Ext.define("Eagle.model.Rota", {
    extend: "Ext.data.Model",
    fields: [
        {name: "idRota", type: "int"},
        {name: "veiculo", reference: "Veiculo"},
        {name: "angulo", type: "int"},
        {name: "atualizada", type: "boolean"},
        {name: "bloqueio", type: "boolean"},
        {name: "conexao", type: "string"},
        {name: "condutor", type: "string"},
        {name: "data", type: "date", dateFormat: "d/m/Y H:i"},
        {name: "emergencia", type: "boolean"},
        {name: "ignicao", type: "boolean"},
        {name: "latitude", type: "number"},
        {name: "longitude", type: "number"},
        {name: "localizacao", type: "string"},
        {name: "referencia", type: "string"},
        {name: "ultima", type: "string"},
        {name: "velocidade", type: "int"},
        {name: "situacao", type: "string"},
        {name: "situacao2", type: "string"},
        
        //Mapeamento para o grid pois não suporta dataIndex: "veiculo.placa"
        {name: "placa", type: "string", mapping: function(data){return data.veiculo.placa;}},
        {name: "frota", type: "string", mapping: function(data){return data.veiculo.frota;}}
    ],
    idProperty: "idRota"
});