Ext.define("Eagle.store.NotificacaoMensagens", {
    extend: "Ext.data.Store",
    model: "Eagle.model.NotificacaoMensagem",
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
        url: "php/notificacoes.php?action=listarMensagens"
    },
    sorters: [{
        direction: "DESC",
        property: "data"
    }]
});