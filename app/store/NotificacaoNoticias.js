Ext.define("Eagle.store.NotificacaoNoticias", {
    extend: "Ext.data.Store",
    model: "Eagle.model.NotificacaoNoticia",
    autoLoad: false,
    pageSize: 0,
    proxy: {
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: "json",
            rootProperty: "data"
        },
        type: "ajax",
        url: "php/notificacoes.php?action=listarInformacoes"
    }
});