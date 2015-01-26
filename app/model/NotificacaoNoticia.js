Ext.define("Eagle.model.NotificacaoNoticia", {
    extend: "Ext.data.Model",
    requires: ["Eagle.model.Notificacao"],
    fields: [
        {name: "author", type: "string"},
        {name: "content", type: "string"},
        {name: "link", type: "string"},
        {name: "publishedDate", type: "date"},
        {name: "title", type: "string"}
    ],
    idProperty: "idNotificacao"
});