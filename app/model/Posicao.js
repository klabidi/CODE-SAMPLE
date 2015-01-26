Ext.define("Eagle.model.Posicao", {
    extend: "Ext.data.Model",
    fields: [
        {name: "idPosicao", type: "int"},
        {name: "dataHora", type: "date", dateFormat: "d/m/Y H:i:s"},
        {name: "latitude", type: "number"},
        {name: "longitude", type: "number"},
        {name: "velocidade", type: "int"},
        {name: "distancia", type: "int"},
        {name: "angulo", type: "int"},
        {name: "ignicao", type: "boolean"},
        {name: "emergencia", type: "boolean"},
        {name: "atualizada", type: "boolean"},
        {name: "bloqueio", type: "boolean"},
        {name: "conexao", type: "string"}
    ],
    idProperty: "idPosicao"
});