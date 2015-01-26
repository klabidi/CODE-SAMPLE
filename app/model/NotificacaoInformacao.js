Ext.define("Eagle.model.NotificacaoInformacao", {
    extend: "Ext.data.Model",
    requires: ["Eagle.model.Notificacao"],
    fields: [
        {name: "remetente", type: "string"},
        {name: "descricao", type: "string"},
        {name: "url", type: "string"}
    ],
    idProperty: "idNotificacao"
});