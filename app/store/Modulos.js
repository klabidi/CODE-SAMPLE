Ext.define("Eagle.store.Modulos", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Modulo",
    autoLoad: false,
    proxy: {
        type: "ajax",
        url: "php/listaModulos.json",
        reader: {
            type: "json",
            rootProperty: "data"
        }
    }
});