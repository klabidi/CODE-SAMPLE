Ext.define("Eagle.store.Estados", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Estado",
    autoLoad: false,
    proxy: {
        type: "ajax",
        url: "php/estados.php?action=listaEstadosCidades",
        reader: {
            type: "json",
            rootProperty: "data"
        }
    },
    sorters: [{
        direction: "ASC",
        property: "nome"
    }]
});