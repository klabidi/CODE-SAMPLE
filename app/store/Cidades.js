Ext.define("Eagle.store.Cidades", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Cidade",
    autoLoad: true,
    proxy: {
        type: "ajax",
        url: "php/cidades.json",
        reader: {
            type: "json",
            rootProperty: "data"
        }
    }
});