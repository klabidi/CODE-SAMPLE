Ext.define("Eagle.model.Notificacao", {
    extend: "Ext.data.Model",
    fields: [
        {name: "idNotificacao", type: "int"},
        {name: "tipo", reference: {type: "NotificacaoTipo", inverse: "notificacoes"}},
        {name: "data", type: "date", dateFormat: "d/m/Y H:i"},
        {name: "visualizada", type: "boolean"},
        {name: "visualizacoes", type: "int"},
        {name: "random", type: "int"}
    ],
    idProperty: "idNotificacao"
});