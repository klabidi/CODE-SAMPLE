Ext.define("Eagle.store.UsuariosTree", {
    extend: "Ext.data.TreeStore",
    autoLoad: false,
    proxy: {
        type: 'ajax', 
        url: 'php/relatorios.php?action=listarUsuariosTree',
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