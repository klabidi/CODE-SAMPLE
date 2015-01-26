Ext.define("Eagle.store.VeiculosTree", {
    extend: "Ext.data.TreeStore",
    autoLoad: false,
    proxy: {
        type: 'ajax', 
        url: 'php/relatorios.php?action=listarVeiculosTree',
        reader: {
            type: 'json'
        },
        actionMethods: {
            read: 'POST'
        }
    },
    root: {
        expanded: true
    },
    sorters: [{
        direction: "ASC",
        property: "text"
    }]
});