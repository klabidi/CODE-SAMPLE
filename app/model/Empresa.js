Ext.define("Eagle.model.Empresa", {
    extend: "Ext.data.Model",
    fields: [
        {name: "idEmpresa", type: "int"},
        {name: "nome", type: "string"},
        {name: "fantasia", type: "string"},
        {name: "tipoEmpresa", type: "string"},
        {name: "cpfCnpj", type: "string"},
        {name: "endereco", reference: "Endereco"},
        {name: "telefone", type: "string"},
        {name: "email", type: "string"},
        {name: "revisada", type: "boolean"},
        {name: "ativa", type: "boolean"}
    ],
    idProperty: "idEmpresa"
});