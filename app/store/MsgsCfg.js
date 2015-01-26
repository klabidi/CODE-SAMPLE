Ext.define("Eagle.store.MsgsCfg", {
    extend: "Ext.data.Store",
    model: "Eagle.model.MsgCfg",
    autoLoad: false,
    
    proxy: {
        type: "ajax",
        api: {
            create: "php/eventoscfg.php?action=inserirMsg",
            read: "php/eventoscfg.php?action=listarMsg",
            destroy: "php/eventoscfg.php?action=removerMsg"
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
        property: "macro"
    }]
});