Ext.define("Eagle.model.Modulo", {
    extend: "Ext.data.Model",
    fields: [
        {name: "id", type: "int"},
        {name: "nome", type: "string"},
        {name: "img", type: "string"},
        {name: "view", type: "string"},
        {name: "modulo", reference: "Modulo"}
    ],
    idProperty: "id"
});