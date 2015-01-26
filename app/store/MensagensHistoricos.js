Ext.define("Eagle.store.MensagensHistoricos", {
    extend: "Ext.data.Store",
    model: "Eagle.model.MensagemHistorico",
    autoLoad: false,
    
    proxy: {
        actionMethods: { 
            read: 'POST'
        },
        reader: {
            type: "json",
            rootProperty: "data"
        },
        type: "ajax",
        url: "php/notificacoes.php?action=listarMensagemHistorico"
        
    },
    sorters: [{
        direction: "DESC",
        property: "data"
    }]
});