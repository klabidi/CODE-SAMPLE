Ext.define("Eagle.model.Endereco", {
    extend: "Ext.data.Model",
    fields: [
        {name: "cidade", reference: "Cidade"},
        {name: "bairro", type: "string"},
        {name: "rua", type: "string"},
        {name: "numero", type: "int"},
        {name: "cep", type: "string"}
    ]
});