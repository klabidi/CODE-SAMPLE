Ext.define("Eagle.store.Eventos", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Evento",
    autoLoad: false,
    pageSize: 0,
    
    proxy: {
        actionMethods: {
            read: "POST"
        },
        reader: {
            type: "json",
            rootProperty: "data"
        },
        type: "ajax",
        url: "php/eventos.php?action=listar"
    },
    sorters: [{
        property: "dataHora",
        direction: "DESC"
    }]
});