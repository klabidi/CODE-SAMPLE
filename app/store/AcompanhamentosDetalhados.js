Ext.define("Eagle.store.AcompanhamentosDetalhados", {
    extend: "Ext.data.Store",
    model: "Eagle.model.AcompanhamentoDetalhado",
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
        url: "php/acompanhamento.php?action=listarDetalhado"
        
    },
    sorters: [{
        direction: "DESC",
        property: "data_inicio"
    }]
});