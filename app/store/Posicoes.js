Ext.define("Eagle.store.Posicoes", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Posicao",
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
        url: "php/posicoes.php?action=listar"
    },
    sorters: [{
        property: "dataHora",
        direction: "DESC"
    }]
});