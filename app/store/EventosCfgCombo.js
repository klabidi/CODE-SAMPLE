Ext.define("Eagle.store.EventosCfgCombo", {
    extend: "Ext.data.Store",
    model: "Eagle.model.EventoCfg",
    autoLoad: false,
    
    proxy: {
        type: "ajax",
        url: "php/eventoscfg.php?action=listarEventosEmpresa",
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: "json",
            rootProperty: "data"
        }
    },
    sorters: [{
        direction: "ASC",
        property: "descricao"
    }]
});