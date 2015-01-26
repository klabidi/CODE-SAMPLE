Ext.define("Eagle.model.Situacao", {
    extend: "Ext.data.Model",
    fields: [
        {name: "idSituacao", type: "int"},
        {name: "descricao", type: "string"},
        {name: "empresa", reference: "Empresa"},
        {name: "idEmpresa", type: "int"}
    ],
    idProperty: "idSituacao"
});