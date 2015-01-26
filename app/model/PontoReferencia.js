Ext.define("Eagle.model.PontoReferencia", {
    extend: "Ext.data.Model",
    
    fields: [
        {name: "idPontoReferencia", type: "int"},
        {name: "descricao", type: "string"},
        {name: "grupo", type: "int"},
        {name: "grupoDescricao", type: "string"},
        {name: "observacao", type: "string"},
        {name: "endereco", type: "string"},
        {name: "cidade", type: "string"},
        {name: "latitude", type: "number"},
        {name: "longitude", type: "number"}
    ],
    idProperty: "idPontoReferencia"
});