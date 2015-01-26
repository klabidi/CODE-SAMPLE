Ext.define("Eagle.store.EventosCfg", {
    extend: "Ext.data.Store",
    model: "Eagle.model.EventoCfg",
    autoLoad: false,
    
    proxy: {
        type: "ajax",
        api: {
            create: "php/eventoscfg.php?action=inserir",
            read: "php/eventoscfg.php?action=listar",
            destroy: "php/eventoscfg.php?action=remover"
        },
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: "json",
            rootProperty: "data"
        },
        writer: {
            type: "json",
            writeAllFields: true,
            encode: true,
            rootProperty: "data"
        }
    },
    sorters: [{
        direction: "ASC",
        property: "descricao"
    }]
});