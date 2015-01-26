Ext.define("Eagle.store.Permissoes",{
    extend: "Ext.data.TreeStore", 
    autoLoad: false, 

    proxy: {
        type: 'ajax', 
        url: 'php/permissoes.php?action=getModulos',
        reader: {
            type: 'json'
        },
        actionMethods: {
            read: 'POST'
        }
    },
    root: {
        expanded: true
    }
    
});