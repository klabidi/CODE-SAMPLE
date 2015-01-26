Ext.define("Eagle.model.Grupo", {
    extend: "Ext.data.Model",
    fields: [
        {name: "idGrupo", type: "int"},
        {name: "descricao", type: "string"}
    ],
    idProperty: "idGrupo"
});