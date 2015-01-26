Ext.define("Eagle.model.Evento", {
    extend: "Ext.data.Model",
    fields: [
        {name: "idEvento", type: "int"},
        {name: "dataHora", type: "date", dateFormat: "d/m/Y H:i:s"},
        {name: "latitude", type: "number"},
        {name: "longitude", type: "number"},
        {name: "descricao", type: "string"},
        {name: "parametro", type: "string"},
        {name: "comParametro", type: "boolean"},
        {name: "enviado", type: "boolean"},
        {name: "requerente", type: "string"},
        {name: "conexao", type: "string"},
        {name: "localizacao", type: "string"},
        {name: "referencia", type: "string"}
    ],
    idProperty: "idEvento"
});