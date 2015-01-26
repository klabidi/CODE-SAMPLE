Ext.define("Eagle.model.Operacao", {
    extend: "Ext.data.Model",
    fields: [
        {name: "idOperacao", type: "int"},
        {name: "nome", type: "string"},
        {name: "descricao", type: "string"},
        {name: "empresa", reference: "Empresa"},
        {name: "padrao", type: "boolean"}
    ],
    idProperty: "idOperacao"
});