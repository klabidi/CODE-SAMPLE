Ext.define("Eagle.model.Estado", {
    extend: "Ext.data.Model",
    fields: [
        {name: "idEstado", type: "int"},
        {name: "nome", type: "string"},
        {name: "sigla", type: "string"}
    ],
    idProperty: "idEstado"
});