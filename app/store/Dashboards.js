Ext.define("Eagle.store.Dashboards", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Dashboard",
    
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
        url: "php/dashboard.php?action=listarTempoMovimento"
        
    },
    sorters: [{
        direction: "ASC",
        property: "placa"
    }]
});