Ext.define("Eagle.model.Usuario", {
    extend: "Ext.data.Model",
    fields: [
        {name: "idUsuario", type: "int"},
        {name: "nome", type: "string"},
        {name: "login", type: "string"},
        {name: "email", type: "string"},
        {name: "empresa", reference: "Empresa"},
        {name: "central", type: "int"},
        {name: "grupo", type: "int"},
        {name: "ativo", type: "boolean"}
    ],
    idProperty: "idUsuario"
});