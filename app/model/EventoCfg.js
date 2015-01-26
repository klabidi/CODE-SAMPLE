Ext.define("Eagle.model.EventoCfg", {
    extend: "Ext.data.Model",
    
    fields: [
        {name: "descricao", type: "string"},
        {name: "codigo", type: "int"},
        {name: "operacao", type: "int"},
        {name: "acessorio", type: "boolean"},
        {name: "acessorioInterno", type: "boolean"},
        {name: "desc_situacao", type: "string"}
    ],
    idProperty: "idNotificacaoEventoCfg"
});