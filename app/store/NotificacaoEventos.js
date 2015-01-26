Ext.define("Eagle.store.NotificacaoEventos", {
    extend: "Ext.data.Store",
    model: "Eagle.model.NotificacaoEvento",
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
        url: "php/notificacoes.php?action=listarEventos"
    },
    sorters: [{
        direction: "DESC",
        property: "data"
    }]
});