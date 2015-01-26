Ext.define("Eagle.model.Comando", {
    extend: "Ext.data.Model",
    
    fields: [
        {name: "descricao", type: "string"},
        {name: "codigo", type: "int"},
        {name: "satelite", type: "boolean"},
        {name: "acessorio", type: "boolean"},
        {name: "acessorioInterno", type: "boolean"},
        {name: "parametros"}
    ],
    idProperty: "codigo"
});