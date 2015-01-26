Ext.define("Eagle.model.MsgCfg", {
    extend: "Ext.data.Model",
    fields: [
        {name: "macro", type: "string"},
        {name: "operacao", type: "int"},
        {name: "desc_situacao", type: "string"}
    ]
});